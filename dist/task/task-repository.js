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
}
//# sourceMappingURL=task-repository.js.map