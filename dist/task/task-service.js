// 추후 별도 에러 파일로 분리하는 것이 좋을 거 같음
class ForbiddenException extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenException";
    }
}
class NotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundException";
    }
}
export class TaskService {
    taskRepository;
    prisma;
    constructor(taskRepository, prisma) {
        this.taskRepository = taskRepository;
        this.prisma = prisma;
    }
    /**
     * @param userId 할 일을 생성하려는 사용자의 ID
     * @param projectId 할 일을 추가할 프로젝트의 ID
     * @param taskBodyDto 생성할 할 일의 정보
     * @returns 생성된 할 일 상세 정보 (DTO)
     */
    createTask = async (userId, projectId, taskBodyDto) => {
        try {
            // 요청한 유저가 프로젝트의 멤버인지 확인
            const member = await this.prisma.member.findFirst({
                where: {
                    user_id: userId,
                    projectId: projectId,
                },
            });
            // 멤버가 아니면 에러 발생
            if (!member) {
                throw new ForbiddenException("할 일을 생성할 권한이 없습니다. 프로젝트의 멤버가 아닙니다.");
            }
            // member id를 사용하여 레포지토리 호출, member.id가 담당자가 됨
            const rawTaskData = await this.taskRepository.createTask(member.id, projectId, taskBodyDto);
            // null 반환 값 검증
            if (!rawTaskData) {
                throw new Error("할 일 생성 후 데이터 조회하는데 실패했습니다.");
            }
            // 반환받은 레포지토리 데이터를 최종 응답 형태에 맞게 가공
            const assigneeUser = rawTaskData.members.users;
            const assignee = assigneeUser
                ? {
                    id: assigneeUser.id,
                    name: assigneeUser.nickname,
                    email: assigneeUser.email,
                    profileImage: assigneeUser.image,
                }
                : null;
            return {
                id: rawTaskData.id,
                projectId: rawTaskData.project_id,
                title: rawTaskData.title,
                startYear: rawTaskData.start_year,
                startMonth: rawTaskData.start_month,
                startDay: rawTaskData.start_day,
                endYear: rawTaskData.end_year,
                endMonth: rawTaskData.end_month,
                endDay: rawTaskData.end_date,
                status: rawTaskData.taskStatus,
                assignee: assignee,
                tags: rawTaskData.tags,
                attachments: rawTaskData.attachments,
                createdAt: rawTaskData.createdAt,
                updatedAt: rawTaskData.updatedAt,
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    };
}
//# sourceMappingURL=task-service.js.map