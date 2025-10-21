export class TaskRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * 프로젝트에 새로운 할 일 생성 및 관련 태그와 첨부팡일을 함께 생성
     * @param memberId 할 일을 생성한 멤버의 ID(담당자)
     * @param projectId 할 일이 속한 프로젝트의 ID
     * @param taskBodyDto 생성할 할 일의 정보
     * @returns 생성된 할 일의 상세 정보
     */
    createTask = async (memberId, projectId, taskBodyDto) => {
        return this.prisma.$transaction(async (tx) => {
            // 레코드 생성
            const newTask = await tx.task.create({
                data: {
                    // 스카마의 task 모델에서 user_id 부분 확인 필요
                    title: taskBodyDto.title,
                    content: "", // request body로 받지 않음. 추후 확인 필요
                    project_id: projectId,
                    member_id: memberId, // 담당자는 생성한 멤버로 자동 지정
                    taskStatus: taskBodyDto.status,
                    start_year: taskBodyDto.startYear,
                    start_month: taskBodyDto.startMonth,
                    start_day: taskBodyDto.startDay,
                    end_year: taskBodyDto.endYear,
                    end_month: taskBodyDto.endMonth,
                    end_date: taskBodyDto.endDay,
                },
            });
            // 요청된 태그가 있을 경우 tags 생성
            if (taskBodyDto.tags && taskBodyDto.tags.length > 0) {
                await tx.tag.createMany({
                    data: taskBodyDto.tags.map((tagName) => ({
                        name: tagName,
                        task_id: newTask.id,
                    })),
                });
            }
            // 요청된 첨부파일이 있으면 attachments 생성
            if (taskBodyDto.attachments && taskBodyDto.attachments.length > 0) {
                await tx.attachment.createMany({
                    data: taskBodyDto.attachments.map((fileUrl) => ({
                        url: fileUrl,
                        task_id: newTask.id,
                        uploaded_at: new Date(),
                    })),
                });
            }
            // 응답 DTO에 필요한 모든 데이터를 포함하여 최종 결과 다시 조회 후 반환
            return tx.task.findUnique({
                where: { id: newTask.id },
                include: {
                    members: {
                        // 담당자(assignee) 정보
                        include: {
                            users: true, // 실제 유저 정보 포함
                        },
                    },
                    tags: true,
                    attachments: true,
                },
            });
        });
    };
    /**
     * 프로젝트의 할 일 목록을 필터링, 정렬, 페이지네이션하여 조회합니다.
     * @param projectId 조회할 프로젝트의 ID
     * @param options 파싱된 쿼리 옵션 (TaskQueryDto)
     * @returns { data: task[], total: number }
     */
    getTasks = async (projectId, options) => {
        const { page = 1, limit = 10, status, assignee, keyword, order = "desc", order_by = "created_at", } = options;
        // 페이지네이션 옵션 계산
        const skip = (page - 1) * limit;
        const take = limit;
        // 필터링, 검색을 위한 WHERE 절 동적 생성
        const where = {
            project_id: projectId, // 해당 프로젝트 ID로 필터링
        };
        if (status) {
            where.taskStatus = status; // 상태 필터
        }
        if (assignee) {
            where.member_id = assignee; // 담당자 필터
        }
        if (keyword) {
            where.title = { contains: keyword, mode: "insensitive" }; // 제목 검색 (대소문자 무시)
        }
        // 정렬을 위한 ORDER BY 절 동적 생성
        const orderByMap = {
            created_at: "createdAt",
            name: "title",
            end_date: "end_date",
        };
        // DTO에서 받은 값을 키로 사용하여 실제 필드명 찾기
        const orderByField = orderByMap[order_by] || "createdAt";
        const orderBy = {
            [orderByField]: order,
        };
        // INCLUDE 절
        const include = {
            members: { include: { users: true } }, // 담당자
            tags: true,
            attachments: true,
        };
        // 트랜잭션으로 테이터와 총 개수를 한번에 조회
        const [tasks, total] = await this.prisma.$transaction([
            // 쿼리 1: 실제 데이터 조회(페이지네이션 적용)
            this.prisma.task.findMany({
                where,
                include,
                orderBy,
                skip,
                take,
            }),
            // 쿼리 2: 총 개수 조회 (페이지네이션 미적용)
            this.prisma.task.count({
                where,
            }),
        ]);
        return { data: tasks, total: total };
    };
}
//# sourceMappingURL=task-repository.js.map