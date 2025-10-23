import { Router } from "express";
import MemberController from "./member.controller.js";
import { validateInviteMember } from "./member.validation.js";

const router = Router();
const memberController = new MemberController();

// GET /projects/:projectId/users - 프로젝트 멤버 목록 조회
router.get(
  "/projects/:projectId/users",
  memberController.getProjectMembers.bind(memberController)
);

// POST /projects/:projectId/invitations - 멤버 초대
router.post(
  "/projects/:projectId/invitations",
  validateInviteMember,
  memberController.inviteMember.bind(memberController)
);

// POST /members/:memberId/accept - 초대 수락 (내부적으로만 사용)
router.post(
  "/members/:memberId/accept",
  memberController.acceptInvitation.bind(memberController)
);

// DELETE /projects/:projectId/users/:userId - 멤버 제외
router.delete(
  "/projects/:projectId/users/:userId",
  memberController.removeMember.bind(memberController)
);

// DELETE /invitations/:invitationId - 초대 취소
router.delete(
  "/invitations/:invitationId",
  memberController.cancelInvitation.bind(memberController)
);

export default router;
