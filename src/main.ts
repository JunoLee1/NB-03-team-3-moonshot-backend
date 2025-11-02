import express, {
  RequestHandler,
  request,
  response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import error_handler from "./middleware/errorMiddle.js";
import userRouter from "./user/user.routes.js";
import authRouter from "./auth/auth.routes.js";
import memberRouter from "./member/member.routes.js";
import commentRouter from "./comment/comment.routes.js";
import subtaskRouter from "./subtask/subtask.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import container from "./container.js";
import passport from "passport";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import HttpError from "./lib/httpError.js";

const PORT = parseInt (process.env.PORT || "8080");
dotenv.config();

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "https://moonshotproject.netlify.app", // 프론트 주소 정확히 써야 함
    credentials: true,
  })
);
app.use(passport.initialize());

const { projectRouterInstance, mainTaskRouterInstance } =
  container.getRouters();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads"); // dist 폴더 기준 상위 폴더에 uploads 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // recursive: true 추가
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 파일 저장 경로
  },
  filename: function (req, file, cb) {
    // 파일명 설정 (타임스탬프 + 원본 확장자)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 예: 5MB 파일 크기 제한
});

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/projects", projectRouterInstance);
app.use("/tasks", mainTaskRouterInstance);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API!" });
});

app.use("/", memberRouter);
app.use("/", commentRouter);
app.use("/", subtaskRouter);

const fileUploadHandler: RequestHandler = (req, res, next) => {
  try {
    // req.file 타입은 @types/multer 설치 후 Express.Multer.File 로 추론될 수 있음
    if (!req.file) {
      // HttpError 사용
      throw new HttpError(400, "파일이 업로드되지 않았습니다.");
    }
    console.log("Uploaded file info:", req.file);

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    res.status(201).json({
      message: "파일 업로드 성공",
      fileUrl: fileUrl,
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      // HttpError 사용 및 next로 전달
      return next(new HttpError(400, `파일 업로드 실패: ${error.message}`));
    }
    // 그 외 에러는 전역 핸들러로 전달
    next(error);
  }
};
app.post("/files", upload.single("file"), fileUploadHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
