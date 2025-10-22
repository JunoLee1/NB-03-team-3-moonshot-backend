import { Router } from "express";
import MemberController from "./member.controller.js";
import { validateInviteMember } from "./member.validation.js";

const router = Router();
const memberController = new MemberController();

// GET /api/projects/:projectId/members - 프로젝트 멤버 목록 조회
router.get(
  "/projects/:projectId/members",
  memberController.getProjectMembers.bind(memberController)
);

// POST /api/projects/:projectId/invitations - 멤버 초대
router.post(
  "/projects/:projectId/invitations",
  validateInviteMember,
  memberController.inviteMember.bind(memberController)
);

// POST /api/members/:memberId/accept - 초대 수락
router.post(
  "/members/:memberId/accept",
  memberController.acceptInvitation.bind(memberController)
);

// DELETE /api/projects/:projectId/members/:userId - 멤버 제외
router.delete(
  "/projects/:projectId/members/:userId",
  memberController.removeMember.bind(memberController)
);

// DELETE /api/members/:memberId/cancel - 초대 취소
router.delete(
  "/members/:memberId/cancel",
  memberController.cancelInvitation.bind(memberController)
);

export default router;
