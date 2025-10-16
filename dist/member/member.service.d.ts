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
    getProjectMembers(project_id: number, user_id: number, query: GetMembersQuery): Promise<{
        data: {
            status: import("@prisma/client").$Enums.status;
            role: string | null;
            taskCount: number;
            id: number;
            email: string;
            nickname: string;
            image: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    inviteMember({ email, project_id, inviter_id }: InviteMemberDTO): Promise<{
        message: string;
        member: {
            users: {
                id: number;
                email: string;
                nickname: string;
                image: string;
            };
        } & {
            id: number;
            user_id: number;
            status: import("@prisma/client").$Enums.status;
            role: string | null;
            joinedAt: Date;
            projectId: number;
        };
    }>;
    acceptInvitation(member_id: number, user_id: number): Promise<{
        users: {
            id: number;
            email: string;
            nickname: string;
            image: string;
        };
    } & {
        id: number;
        user_id: number;
        status: import("@prisma/client").$Enums.status;
        role: string | null;
        joinedAt: Date;
        projectId: number;
    }>;
    removeMember(project_id: number, member_user_id: number, remover_id: number): Promise<{
        message: string;
    }>;
    cancelInvitation(member_id: number, canceller_id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=member.service.d.ts.map