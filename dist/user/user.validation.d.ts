import { z } from "zod";
export declare const userInfoSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    email: z.ZodString;
    password: z.ZodString;
    nickname: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    nickname: string;
    password: string;
    id?: number | undefined;
    image?: string | undefined;
}, {
    email: string;
    nickname: string;
    password: string;
    id?: number | undefined;
    image?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodString;
    image: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    image?: string | undefined;
}, {
    email: string;
    image?: string | undefined;
}>;
export declare const findUserTasksSchema: z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    project_id: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<["todo", "inprogress", "done"]>>;
    keyword: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    project_id: number;
    from?: string | undefined;
    to?: string | undefined;
    keyword?: string | undefined;
    status?: "todo" | "inprogress" | "done" | undefined;
}, {
    project_id: number;
    from?: string | undefined;
    to?: string | undefined;
    keyword?: string | undefined;
    status?: "todo" | "inprogress" | "done" | undefined;
}>;
export declare const findUserProjectsSchema: z.ZodObject<{
    page: z.ZodNumber;
    skip: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    skip: number;
    page: number;
}, {
    skip: number;
    page: number;
}>;
export type UserDTO = z.infer<typeof userInfoSchema>;
//# sourceMappingURL=user.validation.d.ts.map