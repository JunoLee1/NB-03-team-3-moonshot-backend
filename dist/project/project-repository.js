import { status } from "@prisma/client";
export class ProjectRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * @param userId 프로젝트를 생성한 유저의 ID
     * @param CreateProjectDto 프로젝트의 이름과 설명
     * @returns 생성된 프로젝트 정보와 카운트 값
     */
    createProject = async (userId, projectBodyDto) => {
        const newProject = await this.prisma.$transaction(async (tx) => {
            // 프로젝트 생성
            const project = await tx.project.create({
                data: {
                    name: projectBodyDto.name,
                    description: projectBodyDto.description,
                },
            });
            // 생성자를 프로젝트의 멤버로 추가
            await tx.member.create({
                data: {
                    user_id: userId,
                    projectId: project.id, // 스키마 수정 필요 projectId -> project_id
                    joinedAt: new Date(),
                    status: status.accepted, // 스키마 수정 필요, member.status가 Status, 이름 변경이 좋아보임
                    role: "CREATOR", // 생성자를 확인하기 위한 코드, 추후 역할 이름 변경 가능
                },
            });
            return project;
        });
        // 요구사항을 충족하는 응답 객체 구성 및 반환, 추후 서비스 레이어에서 처리하는게 적합하다고 생각됨
        return {
            id: newProject.id,
            name: newProject.name,
            description: newProject.description,
            memberCount: 1, // 생성 시 멤버는 생성자 1명
            todoCount: 0,
            inProgressCount: 0,
            doneCount: 0,
        };
    };
    /**
     * id를 기준으로 프로젝트와 관련된 멤버 및 할 일 목록을 조회함. 응답 객체 구성을 위함
     * @param projectId 조회할 프로젝트의 id
     * @returns 프로젝트 정보 또는 null
     */
    findProjectById = async (projectId) => {
        return this.prisma.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                members: true,
                tasks: {
                    select: {
                        taskStatus: true,
                    },
                },
            },
        });
    };
    /**
     * id를 기준으로 프로젝트의 이름과 설명을 수정하고, 수정된 프로젝트의 상세 정보 반환
     * @param projectId 수정할 프로젝트의 ID
     * @param data 수정할 정보 {name, description}
     * @returns 수정된 프로젝트의 상세 정보 또는 null
     */
    updateProject = async (projectId, projectBodyDto) => {
        // 트랜잭션을 사용하여 수정과 재조회를 실행
        return this.prisma.$transaction(async (tx) => {
            // 프로젝트 정보 수정
            await tx.project.update({
                where: { id: projectId },
                data: {
                    name: projectBodyDto.name,
                    description: projectBodyDto.description,
                },
            });
            // 수정된 최신 데이터를 상세 조회와 동일한 형태로 다시 조회하여 반환
            return tx.project.findUnique({
                where: {
                    id: projectId,
                },
                include: {
                    members: true,
                    tasks: {
                        select: {
                            taskStatus: true,
                        },
                    },
                },
            });
        });
    };
    /**
     * @param projectId 삭제할 프로젝트의 ID
     */
    deleteProjectById = async (projectId) => {
        return this.prisma.project.delete({
            where: { id: projectId },
        });
    };
}
//# sourceMappingURL=project-repository.js.map