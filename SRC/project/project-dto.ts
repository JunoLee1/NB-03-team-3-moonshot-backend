// 요청 body 타입 정의
export interface ProjectBodyDto {
  name: string;
  description: string;
}

// 응답 타입 정의
export interface ProjectResponseDto {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}
