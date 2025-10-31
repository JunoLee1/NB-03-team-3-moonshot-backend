export interface IUserDTO {
  id: number;
  currentPassword?:string| null;
  password?:string| null;
  newPassword?:string|null;
  nickname?: string | null;
  email: string;
  profileImage: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
/*
export interface FindUserTaskQuery{
  from: Date | undefined;
  to: Date | undefined;
  project_id: number | undefined;
  status: `todo` | `in_progress` | `done` | undefined;
  assignee: number | undefined;
  keyword: string | undefined;
}
*/
export interface findUserProjectsQuery {
  take: number;
  skip: number;
  order?: `asc` | `desc`;
  order_by?: `created_at` | `name`;
}

export interface IUser {
  id: number;
  nickname?: string | null;
  newPassword?:string| null;
  currentPassword?:string| null;
  password?:string| null;
  email?: string | null;
  profileImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
