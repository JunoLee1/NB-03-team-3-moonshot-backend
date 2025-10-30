import { Request, Response, NextFunction } from "express";
import MemberService from "./member.service.js";

const memberService = new MemberService();

export default class MemberController {
  // GET /projects/:projectId/members - 프로젝트 멤버 목록 조회
  async getProjectMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = parseInt(req.params.projectId as string);
      // TODO: 인증 미들웨어에서 user_id 가져오기

      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const user_id = req.user.id;

      const query: { page?: number; limit?: number } = {};
      if (req.query.page) query.page = parseInt(req.query.page as string);
      if (req.query.limit) query.limit = parseInt(req.query.limit as string);

      const result = await memberService.getProjectMembers(
        project_id,
        user_id,
        query
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /projects/:projectId/invitations - 멤버 초대
  async inviteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = parseInt(req.params.projectId as string);
      const { email } = req.body;
      // TODO: 인증 미들웨어에서 user_id 가져오기
      const inviter_id = req.body.user_id;

      const result = await memberService.inviteMember({
        email,
        project_id,
        inviter_id,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /members/:memberId/accept - 초대 수락
  async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const member_id = parseInt(req.params.memberId as string);
      // TODO: 인증 미들웨어에서 user_id 가져오기
      const user_id = req.body.user_id;

      const result = await memberService.acceptInvitation(member_id, user_id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /projects/:projectId/members/:userId - 멤버 제외
  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const project_id = parseInt(req.params.projectId as string);
      const member_user_id = parseInt(req.params.userId as string);
      // TODO: 인증 미들웨어에서 user_id 가져오기
      const remover_id = req.body.user_id;

      const result = await memberService.removeMember(
        project_id,
        member_user_id,
        remover_id
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /invitations/:invitationId - 초대 취소
  async cancelInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const member_id = parseInt(req.params.invitationId as string);
      // TODO: 인증 미들웨어에서 user_id 가져오기
      const canceller_id = req.body.user_id;

      const result = await memberService.cancelInvitation(
        member_id,
        canceller_id
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
