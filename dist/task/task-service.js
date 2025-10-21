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
    /**
     * @param userId 요청한 사용자의 ID
     * @param projectId 조회할 프로젝트의 ID
     * @param query 컨트로럴에서 받은 req.query 객체
     * @returns { data: TaskResponseDto[], total: number }
     */
    getTasks = async (userId, projectId, query) => {
        try {
            // 요청한 유저가 이 프로젝트의 멤버인지 확인
            const member = await this.prisma.member.findFirst({
                where: {
                    user_id: userId,
                    projectId: projectId,
                },
            });
            if (!member) {
                throw new ForbiddenException("할 일 목록을 조회할 권한이 없습니다. 프로젝트 멤버가 아닙니다.");
            }
            // 쿼리 파라미터 파싱 및 타입 변환, 기본값 우선 정의
            const options = {
                page: query.page ? parseInt(String(query.page), 10) : 1,
                limit: query.limit ? parseInt(String(query.limit), 10) : 10,
                order: query.order ? query.order : "desc",
                order_by: query.order_by
                    ? query.order_by
                    : "created_at",
            };
            // 값이 존재하면 객체에 속성 추가
            if (query.status) {
                options.status = query.status;
            }
            if (query.assignee) {
                options.assignee = parseInt(String(query.assignee), 10);
            }
            if (query.keyword) {
                options.keyword = String(query.keyword);
            }
            // 파싱된 숫자 유효성 검사
            if (Number.isNaN(options.page) ||
                Number.isNaN(options.limit) ||
                (options.assignee && Number.isNaN(options.assignee))) {
                throw new Error("page와 limit는 숫자여야 합니다."); // 추후 커스텀 에러 적용이 좋을 거 같음
            }
            const { data: rawTasks, total } = await this.taskRepository.getTasks(projectId, options);
            // 데이터 가공, createTasks 메서드의 변환로직과 중복, 추후 다른 메서드로 분리하면 좋을 거 같음
            const taskDtos = rawTasks.map((task) => {
                const assigneeUser = task.members.users;
                const assignee = assigneeUser
                    ? {
                        id: assigneeUser.id,
                        name: assigneeUser.nickname,
                        email: assigneeUser.email,
                        profileImage: assigneeUser.image,
                    }
                    : null;
                return {
                    id: task.id,
                    projectId: task.project_id,
                    title: task.title,
                    startYear: task.start_year,
                    startMonth: task.start_month,
                    startDay: task.start_day,
                    endYear: task.end_year,
                    endMonth: task.end_month,
                    endDay: task.end_date,
                    status: task.taskStatus,
                    assignee: assignee,
                    tags: task.tags,
                    attachments: task.attachments,
                    createdAt: task.createdAt,
                    updatedAt: task.updatedAt,
                };
            });
            // 최종 응답 DTO 반환
            return {
                data: taskDtos,
                total: total,
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    };
    /**
     * 할 일 상세 조회
     * @param userId 요청한 사용자의 ID
     * @param taskId 조회할 할 일의 ID
     * @returns 가공된 할 일의 상세 정보
     */
    getTaskById = async (userId, taskId) => {
        try {
            // 할 일 권한 검사용 데이터 조회를 위한 레포지토리 호출
            const rawTaskData = await this.taskRepository.findTaskById(taskId);
            // 할 일 존재 여부 검증
            if (!rawTaskData) {
                throw new NotFoundException("할 일을 찾을 수 없습니다.");
            }
            // 요청한 유저의 권한 검사
            const projectMembers = rawTaskData.projects.members;
            const isMember = projectMembers.some((member) => member.user_id === userId);
            if (!isMember) {
                throw new ForbiddenException("할 일을 조회할 권한이 없습니다.");
            }
            // 응답 형태에 맞게 가공, 추후 리팩토링 예정
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