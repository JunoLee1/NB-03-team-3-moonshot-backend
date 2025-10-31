// SRC/validations/user.validation.ts
import { z } from "zod";

// Define the schema once
export const userInfoSchema = z.object({
  id: z.number().int().positive().optional(),
  email: z.string().email("이메일 형식이 아닙니다."),
  password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상")
    .max(20, "닉네임은 최대 20자 이하여야 합니다."),
  image: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email("이메일 형식이 아닙니다.").optional(),
  image: z.string().optional(),
  nickname: z
    .string()
    .min(2, "닉네임은 최소 2자 이상")
    .max(20, "닉네임은 최대 20자 이하여야 합니다.").optional(),
  currentPassword: z.string().min(8, "현재 비밀번호는 8자리 이상이어야 합니다."),
  newPassword: z.string().min(8, "새 비밀번호는 8자리 이상이어야 합니다."),
});

export const findUserTasksSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  project_id: z.coerce.number().positive("양의 정수여야 합니다").optional(),
  status: z.enum(["todo", "inprogress", "done"]).optional(),
  keyword: z.string().optional(),
});
export const findUserProjectsSchema = z.object({
  page: z
    .number()
    .positive()
    .min(1, "1보다 크거나 같아야 합니다")
    .max(99, "100 미만 이어야합니다")
    .optional(),
  skip: z
    .number()
    .positive()
    .min(10, "10이상 합니다")
    .max(99, "100 미만 이어야합니다")
    .optional(),
});
// Infer the DTO type
export type UserDTO = z.infer<typeof userInfoSchema>;
