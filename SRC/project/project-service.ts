import { ProjectRepository } from './project-repository.js';
import { CreateProjectDto, ProjectResponseDto } from './project-dto.js';
import { PrismaClient } from '@prisma/client'; // prisma 추후 레포지토리 계층에서만 사용할 수 있도록 리팩토링 하는게 좋을 것 같음. (관심사 분리)

// 커스텀 에러 임시, 추후 별도 파일로 분리하는 것이 좋을 것 같음
class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

export class ProjectService {
    constructor(private projectRepository: ProjectRepository, private prisma: PrismaClient,) {}
    
     createProject = async( userId: number, createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> => {
        try {
            // 유저가 생성한 프로젝트의 개수를 확인
            const projectCount = await this.prisma.member.count({
                where: {
                    user_id: userId,
                    role: 'CREATOR', // 매직스트링 사용 자제, enum 이나 상수 객체로 관리하는 것이 좋을 것 같음
                },
            });

            // 생성한 프로젝트의 수가 5개를 초과하면 에러 발생
            if (projectCount >= 5) {
                throw new ForbiddenException('프로젝트는 최대 5개까지만 생성할 수 있습니다');
            }

            // 레포지토리 호출
            return await this.projectRepository.createProject(
                userId,
                createProjectDto,
            );
        } catch (error) {
            console.error(error); // 에러 로깅
            throw error;
        }
     }
}