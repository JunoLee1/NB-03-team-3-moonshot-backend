import express from "express";
import type {Request,Response} from "express";
import UserController from "./user.controller.js"
const router = express.Router();
// 유저 정보 조회하기 API
//  클라이언트에게서 받은 요청을 컨트롤러로 보내기
// 해당 유저가 맞는지 아닌지 확인 하는 로직작성
// to do : 팀원과 상담후 error 핸들러 미들웨어에 작성후 쓰기 
// to do : 팀원과 상담후  req 핸들러 미들웨어에서 작성후 쓰기'

const userController = new UserController()
router.get("/me",async(req: Request, res:Response)=>
    userController.userInfoController(req, res)
)

// 유저 정보 수정하기 API
// 클라이언트의 정보가 존재하는지 확인 

router.patch("/me",async(req: Request, res:Response)=>{
    userController.userUpdateController(req, res)
})

// 해당 유저가 참여중인 모든 프로젝트의 할일 목록 조회 API
router.get("/me/projects",async(req: Request, res:Response)=>{
    userController.findUsedrProjectsController(req, res)
})

export default router;