import { Request, Response, NextFunction } from "express";
export default class MemberController {
    getProjectMembers(req: Request, res: Response, next: NextFunction): Promise<void>;
    inviteMember(req: Request, res: Response, next: NextFunction): Promise<void>;
    acceptInvitation(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeMember(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelInvitation(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=member.controller.d.ts.map