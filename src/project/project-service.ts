import { ProjectRepository } from "./project-repository.js";
import { ProjectBodyDto, ProjectResponseDto } from "./project-dto.js";
import { PrismaClient } from "@prisma/client"; // prisma 추후 레포지토리 계층에서만 사용할 수 있도록 리팩토링 하는게 좋을 것 같음. (관심사 분리)
import { EmailService } from "../lib/email-service.js";

// 커스텀 에러 임시, 추후 별도 파일로 분리하는 것이 좋을 것 같음
class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
  }
}

// 찾을 수 없는거에 대한 커스텀 에러
class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}

export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private prisma: PrismaClient,
    private emailService: EmailService
  ) {}

  createProject = async (
    userId: number,
    projectBodyDto: ProjectBodyDto
  ): Promise<ProjectResponseDto> => {
    try {
      // 유저가 생성한 프로젝트의 개수를 확인
      const projectCount = await this.prisma.member.count({
        where: {
          user_id: userId,
          role: "CREATOR", // 매직스트링 사용 자제, enum 이나 상수 객체로 관리하는 것이 좋을 것 같음
        },
      });

      // 생성한 프로젝트의 수가 5개를 초과하면 에러 발생
      if (projectCount >= 5) {
        throw new ForbiddenException(
          "프로젝트는 최대 5개까지만 생성할 수 있습니다"
        );
      }

      // 레포지토리 호출
      return await this.projectRepository.createProject(userId, projectBodyDto);
    } catch (error) {
      console.error(error); // 에러 로깅
      throw error;
    }
  };

  getProjectDetails = async (
    userId: number,
    projectId: number
  ): Promise<ProjectResponseDto> => {
    try {
      // 레포지토리를 호출하여 id로 프로젝트 관련 데이터 조회
      const projectData = await this.projectRepository.findProjectById(
        projectId
      );

      // 프로젝트 존재 여부 확인
      if (!projectData) {
        throw new NotFoundException("프로젝트를 찾을 수 없습니다.");
      }

      // 요청한 사용자가 프로젝트 멤버인지 확인
      const isMember = projectData.members.some(
        (member) => member.user_id === userId
      );
      if (!isMember) {
        throw new ForbiddenException("프로젝트에 접근할 권한이 없습니다.");
      }

      // 카운트 계산
      const memberCount = projectData.members.length;

      const taskCounts = projectData.tasks.reduce(
        (counts, task) => {
          if (task.task_status === "todo") {
            counts.todoCount++;
          } else if (task.task_status === "in_progress") {
            counts.inProgressCount++;
          } else if (task.task_status === "done") {
            counts.doneCount++;
          }
          return counts;
        },
        { todoCount: 0, inProgressCount: 0, doneCount: 0 } // reduce 함수의 초기값
      );

      // 최종 응답 객체 조립
      return {
        id: projectData.id,
        name: projectData.name,
        description: projectData.description,
        memberCount: memberCount,
        ...taskCounts,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * 프로젝트 정보 수정
   * @param userId 요청한 사용자의 ID
   * @param projectId 수정할 프로젝트의 ID
   * @param projectBodyDto 수정할 정보 { name, description}
   * @returns 수정된 프로젝트 상세 정보
   */
  updateProject = async (
    userId: number,
    projectId: number,
    projectBodyDto: ProjectBodyDto
  ): Promise<ProjectResponseDto> => {
    try {
      // 수정 전, 프로젝트의 현재 상태를 조회하여 권한 검사에 사용
      const projectData = await this.projectRepository.findProjectById(
        projectId
      );

      // 프로젝트 존재 여부 확인
      if (!projectData) {
        throw new NotFoundException("프로젝트를 찾을 수 없습니다.");
      }

      // 요청한 사용자가 관리자인지 확인
      const creator = projectData.members.find(
        (member) => member.role === "CREATOR"
      );
      if (!creator || creator.user_id !== userId) {
        throw new ForbiddenException("프로젝트를 수정할 권한이 없습니다.");
      }

      // 모든 검증 통과 후 레포지토리에 업데이트 요청
      const updatedProjectData = await this.projectRepository.updateProject(
        projectId,
        projectBodyDto
      );

      // updatedProjectData 검증
      if (!updatedProjectData) {
        throw new NotFoundException(
          "프로젝트를 업데이트 하는 중 예상치 못한 오류가 발생했습니다."
        );
      }

      // 수정된 최신 데이터를 최종 응답 형태에 맞도록 가공, 추후 리팩토링 시 별도의 메서드로 분리하여 사용하는게 좋을 거 같음
      const memberCount = updatedProjectData.members.length;
      const taskCounts = updatedProjectData.tasks.reduce(
        (counts, task) => {
          if (task.task_status === "todo") counts.todoCount++;
          else if (task.task_status === "in_progress") counts.inProgressCount++;
          else if (task.task_status === "done") counts.doneCount++;
          return counts;
        },
        { todoCount: 0, inProgressCount: 0, doneCount: 0 }
      );
      // 최종 응답 객체 조립 및 반환
      return {
        id: updatedProjectData.id,
        name: updatedProjectData.name,
        description: updatedProjectData.description,
        memberCount: memberCount,
        ...taskCounts,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteProject = async (userId: number, projectId: number): Promise<void> => {
    try {
      //  권한 검사 및 알림 대상 조회를 위해 프로젝트 정보 및 멤버 이메일를 조회
      const projectData = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          members: {
            include: {
              users: {
                // 멤버의 User 정보 (이메일 포함)
                select: { id: true, email: true, nickname: true }, // id도 가져와서 본인 제외
              },
            },
          },
        },
      });

      // 프로젝트 존재 여부 확인
      if (!projectData) {
        throw new NotFoundException("프로젝트를 찾을 수 없습니다.");
      }

      // 요청한 사용자가 관리자인지 권한 검사
      const creator = projectData.members.find(
        (member) => member.role === "CREATOR" && member.user_id === userId
      );
      if (!creator || creator.user_id !== userId) {
        throw new ForbiddenException("프로젝트를 삭제할 권한이 없습니다.");
      }

      // 삭제될 프로젝트 이름과 알림 받을 멤버 이메일 목록 저장
      const projectName = projectData.name;
      const membersToNotify = projectData.members
        .filter((member) => member.user_id !== userId) // 본인 제외
        .map((member) => member.users.email) // 이메일 주소만 추출
        .filter((email): email is string => !!email); // null/undefined 이메일 제외

      await this.projectRepository.deleteProjectById(projectId);

      // 삭제 성공 시 저장해둔 멤버들에게 이메일 발송
      if (membersToNotify.length > 0) {
        console.log(
          `Sending deletion notification for project "${projectName}" to:`,
          membersToNotify
        );
        await this.emailService.sendProjectDeletionNotice(
          projectName,
          membersToNotify
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
