export interface CreateCommentDTO {
    content: string;
    task_id: number;
    user_id: number;
}
export interface UpdateCommentDTO {
    content: string;
}
export default class CommentService {
    createComment({ content, task_id, user_id }: CreateCommentDTO): Promise<{
        users: {
            id: number;
            email: string;
            nickname: string | null;
            image: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        user_id: number;
        task_id: number;
    }>;
    getCommentsByTaskId(task_id: number, user_id: number): Promise<({
        users: {
            id: number;
            email: string;
            nickname: string | null;
            image: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        user_id: number;
        task_id: number;
    })[]>;
    updateComment(comment_id: number, user_id: number, { content }: UpdateCommentDTO): Promise<{
        users: {
            id: number;
            email: string;
            nickname: string | null;
            image: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        user_id: number;
        task_id: number;
    }>;
    deleteComment(comment_id: number, user_id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=comment.service.d.ts.map