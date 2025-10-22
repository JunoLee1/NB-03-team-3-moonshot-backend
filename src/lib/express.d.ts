
import Express from 'express'; 
import {IUserDTO} from "../user/user.controller.ts"
declare global {
  namespace Express {
    interface User{
      id?: number,
      nickname :string | null,
      password: string | null,
    }
    interface Request {
      user?:IUserDTO
    }
  }
}
