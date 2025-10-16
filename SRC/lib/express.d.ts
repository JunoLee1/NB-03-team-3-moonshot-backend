import Express from 'express'; 
import {IUser} from "../user/user.controller.ts"
declare global {
  namespace Express {
    interface Request {
      user:IUser
    }
  }
}