import { Router } from "express";
import { ProjectController } from "./project-controller.js";
declare const projectRouter: (projectController: ProjectController, taskRouter: Router) => import("express-serve-static-core").Router;
export default projectRouter;
//# sourceMappingURL=project-router.d.ts.map