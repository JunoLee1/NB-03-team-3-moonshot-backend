import express from "express";
import dotenv from "dotenv";
import error_handler from "./middleware/errorMiddle.js";
import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import container from "./container.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { projectRouterInstance, mainTaskRouterInstance } =
  container.getRouters();

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/projects", projectRouterInstance);
app.use("/tasks", mainTaskRouterInstance);

app.use(error_handler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
