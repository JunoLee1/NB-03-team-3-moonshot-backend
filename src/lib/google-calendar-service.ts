import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { TaskResponseDto } from "../task/task-dto.js";
import { User } from "@prisma/client";
import prisma from "./prisma.js";

export class GoogleCalendarService {
  // OAuth2 클라이언트 인스턴스를 생성합니다.
  private getOauth2Client(): OAuth2Client {
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.REDIRECT_URI
    ) {
      throw new Error(
        ".env 파일에 Google OAuth 환경 변수가 설정되지 않았습니다."
      );
    }
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
  }

  // Task DTO를 Google Calendar 이벤트 형식으로 변환합니다.
  private taskToCalendarEvent(
    taskDto: TaskResponseDto
  ): calendar_v3.Schema$Event {
    // 시작 날짜 (YYYY-MM-DD)
    const startDate = `${taskDto.startYear}-${String(
      taskDto.startMonth
    ).padStart(2, "0")}-${String(taskDto.startDay).padStart(2, "0")}`; // 종료 날짜 (YYYY-MM-DD) // Google Calendar의 'date' 이벤트는 종료일이 exclusive(그날 포함 안 함)이므로 +1일을 해줘야 함
    const endDate = new Date(
      taskDto.endYear,
      taskDto.endMonth - 1,
      taskDto.endDay + 1
    )
      .toISOString()
      .split("T")[0];

    return {
      summary: taskDto.title,
      description: `[Moonshot Task] 상태: ${taskDto.taskStatus}\n프로젝트 ID: ${taskDto.projectId}`,
      start: { date: startDate },
      end: { date: endDate ?? null },
    };
  }

  // 사용자 ID를 기반으로 인증된 Calendar 클라이언트를 가져옵니다.
  private async getCalendarClient(
    userId: number
  ): Promise<calendar_v3.Calendar | null> {
    const user = await prisma.user.findUnique({ where: { id: userId } }); // Refresh Token 존재 확인
    if (!user || !user.googleRefreshToken) {
      console.warn(
        `User ${userId}님은 Google Calendar 동기화를 사용할 수 없습니다 (refresh token이 없습니다).`
      );
      return null;
    }

    const oauth2Client = this.getOauth2Client();
    oauth2Client.setCredentials({
      access_token: user.googleAccessToken,
      refresh_token: user.googleRefreshToken, // expiry_date: user.googleTokenExpiresAt?.getTime() // 만료 시간 설정 (선택 사항)
    });

    // Access Token 만료 시 자동 갱신 리스너
    oauth2Client.on("tokens", async (tokens) => {
      if (tokens.refresh_token) {
        // 새 refresh_token 발급 시 DB 업데이트
        console.log(
          `[Calendar Auth] User ${userId}님에게 새 refresh token이 발급되었습니다.`
        );
        await prisma.user.update({
          where: { id: userId },
          data: { googleRefreshToken: tokens.refresh_token },
        });
      } // Access Token 갱신 시 DB 업데이트 (만료 시간 포함)
      console.log(
        `[Calendar Auth] User ${userId}님의 access token이 갱신되었습니다.`
      );
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token ?? null,
          googleTokenExpiresAt: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
        },
      });
    });
    return google.calendar({ version: "v3", auth: oauth2Client });
  }

  // Google Calendar에 새 이벤트를 생성합니다.
  async createEvent(
    userId: number,
    taskDto: TaskResponseDto
  ): Promise<string | null> {
    const calendar = await this.getCalendarClient(userId);
    if (!calendar) return null;

    const event = this.taskToCalendarEvent(taskDto);
    try {
      const response = await calendar.events.insert({
        calendarId: "primary",
        requestBody: event,
      });
      const eventId = response.data.id;
      console.log(
        `[Calendar] 이벤트 생성됨 (ID: ${eventId}) / Task ID: ${taskDto.id}`
      );
      return eventId || null;
    } catch (error) {
      console.error(
        `[Calendar Error] Task ${taskDto.id}의 이벤트 생성 오류:`,
        error
      );
      return null;
    }
  }

  // Google Calendar의 이벤트를 수정합니다.
  async updateEvent(
    userId: number,
    eventId: string,
    taskDto: TaskResponseDto
  ): Promise<void> {
    const calendar = await this.getCalendarClient(userId);
    if (!calendar) return;

    const event = this.taskToCalendarEvent(taskDto);
    try {
      await calendar.events.update({
        calendarId: "primary",
        eventId,
        requestBody: event,
      });
      console.log(
        `[Calendar] 이벤트 수정됨 (ID: ${eventId}) / Task ID: ${taskDto.id}`
      );
    } catch (error) {
      console.error(
        `[Calendar Error] Task ${taskDto.id} (Event ID: ${eventId})의 이벤트 수정 오류:`,
        error
      );
    }
  }

  // Google Calendar의 이벤트를 삭제합니다.
  async deleteEvent(userId: number, eventId: string): Promise<void> {
    const calendar = await this.getCalendarClient(userId);
    if (!calendar) return;

    try {
      await calendar.events.delete({
        calendarId: "primary",
        eventId,
      });
      console.log(`[Calendar] 이벤트 삭제됨 (ID: ${eventId})`);
    } catch (error: any) {
      // 이미 삭제되었거나 찾을 수 없는 경우 (410, 404)
      if (error.code === 410 || error.code === 404) {
        console.warn(
          `[Calendar Warn] 삭제하려는 이벤트(ID: ${eventId})를 찾을 수 없습니다.`
        );
      } else {
        console.error(
          `[Calendar Error] 이벤트(ID: ${eventId}) 삭제 오류:`,
          error
        );
      }
    }
  }
}
