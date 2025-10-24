# 댓글 & 멤버 기능 구현

## 구현 완료 기능

### 댓글 (Comment)
- 댓글 생성 (프로젝트 멤버만)
- 댓글 목록 조회 (프로젝트 멤버만)
- 댓글 수정 (작성자만)
- 댓글 삭제 (작성자만)

### 멤버 (Member)
- 멤버 목록 조회 (페이지네이션)
- 멤버 초대 (소유자만)
- 초대 수락
- 멤버 제외 (소유자만)
- 초대 취소 (소유자만)

## API 엔드포인트

### 댓글
- `POST /tasks/:taskId/comments` - 댓글 생성
- `GET /tasks/:taskId/comments` - 댓글 목록
- `PATCH /comments/:commentId` - 댓글 수정
- `DELETE /comments/:commentId` - 댓글 삭제

### 멤버
- `GET /projects/:projectId/users` - 멤버 목록
- `POST /projects/:projectId/invitations` - 멤버 초대
- `POST /members/:memberId/accept` - 초대 수락
- `DELETE /projects/:projectId/users/:userId` - 멤버 제외
- `DELETE /invitations/:invitationId` - 초대 취소

## 통합 방법

### 라우트 추가
```typescript
import commentRoutes from "./comment/comment.routes.js";
import memberRoutes from "./member/member.routes.js";

// /api prefix 없이 직접 라우트 등록
app.use(commentRoutes);
app.use(memberRoutes);
```

### 인증 미들웨어 연동 필요
현재 `user_id`를 임시로 body/query에서 받고 있습니다.
인증 미들웨어 구현 후 `req.user.id`로 변경 필요

수정 파일:
- `comment.controller.ts`
- `member.controller.ts`
- `comment.validation.ts`
- `member.validation.ts`
