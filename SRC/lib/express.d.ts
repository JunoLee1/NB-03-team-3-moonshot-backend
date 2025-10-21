import Express from 'express'; 
import {IUserDTO} from "../user/user.controller.ts"
declare global {
  namespace Express {
    interface User{
      id?: number,
      nickname :string,
      password: string,
    }
    interface Request {
      user?:IUserDTO
    }
  }
}