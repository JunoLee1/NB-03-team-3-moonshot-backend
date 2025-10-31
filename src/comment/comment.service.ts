import prisma from "../lib/prisma.js";

export interface CreateCommentDTO {
  content: string;
  task_id: number;
  user_id:number;
}

export interface UpdateCommentDTO {
  content: string;
}

export default class CommentService {
  // 댓글 생성
  async createComment({ content, task_id, user_id }: CreateCommentDTO) {
    // 태스크 존재 확인
    const task = await prisma.task.findUnique({
      where: { id: task_id },
      include: { projects: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // 프로젝트 멤버인지 확인
    const isMember = await prisma.member.findFirst({
      where: {
        user_id: user_id,
        project_id: task.project_id,
        status: "accepted",
      },
    });

    if (!isMember) {
      throw new Error("You are not a member of this project");
    }

    // 댓글 생성
    
    const comment = await prisma.comment.create({
      data: {
        content,
        task_id,
        user_id,
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profileImage:true,
          },
        },
      },
    });
    const result = {
      id : comment.id,
      content: comment.content,
      taskId: comment.task_id,
      author: comment.users,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }

    return result;
  }

  // 태스크별 댓글 목록 조회
  async getCommentsByTaskId(task_id: number, user_id: number) {
    const task = await prisma.task.findUnique({
      where: { id: task_id },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // 프로젝트 멤버만 조회 가능
    const isMember = await prisma.member.findFirst({
      where: {
        user_id: user_id,// 수정바람
        project_id: task.project_id,
        status: "accepted",
      },
    });

    if (!isMember) {
      throw new Error("You are not a member of this project");
    }

    const comments = await prisma.comment.findMany({
      where: { task_id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profileImage: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
    });

    const result = comments.map(comment => ({
      id : comment.id,
      content: comment.content,
      taskId: comment.task_id,
      author: comment.users,
      createdAt: comment.created_at,
      updatedAt: comment.updated_at,
    }))
    return result;
  }

  // 댓글 수정
  async updateComment(comment_id: number, user_id: number, { content }: UpdateCommentDTO) {
    const comment = await prisma.comment.findUnique({
      where: { id: comment_id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // 본인 댓글만 수정 가능
    if (comment.user_id !== user_id) {
      throw new Error("You can only update your own comments");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment_id },
      data: { content },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            nickname: true,
            profileImage: true,
          },
        },
      },
    });

    return updatedComment;
  }

  // 댓글 삭제
  async deleteComment(comment_id: number, user_id: number) {
    const comment = await prisma.comment.findUnique({
      where: { id: comment_id },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // 본인 댓글만 삭제 가능
    if (comment.user_id !== user_id) {
      throw new Error("You can only delete your own comments");
    }

    await prisma.comment.delete({
      where: { id: comment_id },
    });

    return { message: "Comment deleted successfully" };
  }
}
