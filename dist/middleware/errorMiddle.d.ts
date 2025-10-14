import { Request, Response, NextFunction } from "express";
declare function error_handler(error: any, req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>>;
export default error_handler;
//# sourceMappingURL=errorMiddle.d.ts.map