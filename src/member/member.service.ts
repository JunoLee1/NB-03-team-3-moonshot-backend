import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";

export interface InviteMemberDTO {
  email: string;
  project_id: number;
  inviter_id: number;
}

export interface GetMembersQuery {
  page?: number;
  limit?: number;
}

export default class MemberService {
  // 멤버 목록 조회
  async getProjectMembers(project_id: number, user_id: number, query: GetMembersQuery) {
    const project = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // 프로젝트 멤버만 조회 가능
    const isMember = await prisma.member.findFirst({
      where: {
        user_id: user_id,
        project_id: project_id,
      },
    });

    if (!isMember) {
      throw new Error("You are not a member of this project");
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where: { project_id: project_id },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              nickname: true,
              profile_image: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { joined_at: "desc" },
      }),
      prisma.member.count({
        where: { project_id: project_id },
      }),
    ]);

    const membersWithTaskCount = await Promise.all(
      members.map(async (member: typeof members[0]) => {
        const taskCount = await prisma.task.count({
          where: {
            member_id: member.id,
            project_id: project_id,
          },
        });

        return {
          ...member.users,
          status: member.status,
          role: member.role,
          taskCount,
        };
      })
    );

    return {
      data: membersWithTaskCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // 멤버 초대
  async inviteMember({ email, project_id, inviter_id }: InviteMemberDTO) {
    const project = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // 프로젝트 소유자만 초대 가능
    const inviterMember = await prisma.member.findFirst({
      where: {
        user_id: inviter_id,
        project_id: project_id,
        role: "owner",
      },
    });

    if (!inviterMember) {
      throw new Error("Only project owner can invite members");
    }

    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      throw new HttpError(400, "User with this email not found");
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        user_id: invitedUser.id,
        project_id: project_id,
      },
    });

    if (existingMember) {
      throw new HttpError(400, "User is already a member of this project");
    }

    const member = await prisma.member.create({
      data: {
        user_id: invitedUser.id,
        project_id: project_id,
        role: "member",
        status: "pending",
        joined_at: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    // TODO: 이메일 발송 로직 추가

    return {
      message: "Invitation sent successfully",
      member,
    };
  }

  // 초대 수락
  async acceptInvitation(member_id: number, user_id: number) {
    const member = await prisma.member.findUnique({
      where: { id: member_id },
    });

    if (!member) {
      throw new Error("Invitation not found");
    }

    // 본인 초대만 수락 가능
    if (member.user_id !== user_id) {
      throw new Error("You can only accept your own invitations");
    }

    if (member.status === "accepted") {
      throw new HttpError(400,"Invitation has already been accepted")
    }

    const updatedMember = await prisma.member.update({
      where: { id: member_id },
      data: {
        status: "accepted",
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    return updatedMember;
  }

  // 멤버 제외
  async removeMember(project_id: number, member_user_id: number, remover_id: number) {
    const project = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      throw new HttpError(404, "Project not found");//throw new Error("Project not found");
    }

    // 프로젝트 소유자만 제외 가능
    const removerMember = await prisma.member.findFirst({
      where: {
        user_id: remover_id,
        project_id: project_id,
        role: "owner",
      },
    });

    
    if (!removerMember) {
      throw new Error("Only project owner can remove members");
    }

    const memberToRemove = await prisma.member.findFirst({
      where: {
        user_id: member_user_id,
        project_id: project_id,
      },
    });

    if (!memberToRemove) {
       throw new HttpError(404,"Member not found in this project")//throw new Error("Member not found in this project");
    }

    // 소유자는 제외 불가
    if (memberToRemove.role === "owner") {
      throw new HttpError(400,"Cannot remove project owner")//throw new Error("Cannot remove project owner");
    }

    await prisma.member.delete({
      where: { id: memberToRemove.id },
    });

    return { message: "Member removed successfully" };
  }

  // 초대 취소
  async cancelInvitation(member_id: number, canceller_id: number) {
    const member = await prisma.member.findUnique({
      where: { id: member_id },
      include: { projects: true },
    });

    if (!member) {
      throw new HttpError(404,"Invitation not found")
      //throw new Error("Invitation not found");
    }

    // 프로젝트 소유자만 취소 가능
    const cancellerMember = await prisma.member.findFirst({
      where: {
        user_id: canceller_id,
        project_id: member.project_id,
        role: "owner",
      },
    });

    if (!cancellerMember) {
      throw new Error("Only project owner can cancel invitations");
    }

    // pending 상태만 취소 가능
    if (member.status !== "pending") {
      throw new HttpError(400, "Can only cancel pending invitations")
      //throw new Error("Can only cancel pending invitations");
    }

    await prisma.member.delete({
      where: { id: member_id },
    });

    return { message: "Invitation cancelled successfully" };
  }
}
