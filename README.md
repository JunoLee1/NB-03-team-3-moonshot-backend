# NB-03-team-3-moonshot
# Moonshot - 효율적인 프로젝트 일정 관리 서비스

## 팀원 구성

- [이준오](https://github.com/JunoLee1)
- [주예찬](https://github.com/jooyc135)
- [박형익](https://github.com/Sw-twt)
- [홍준기](https://github.com/InsipidPie1229)

## 프로젝트 소개

본 프로젝트는 개인 또는 팀원이 사용할 수 있는 효율적인 프로젝트 일정 관리 서비스인 ‘Moonshot’의 백엔드 시스템입니다.
사용자는 프로젝트를 생성하고 멤버를 이메일로 초대하여 할 일을 등록 및 관리할 수 있습니다. 또한, 칸반 보드, 구글 캘린더 API 연동을 통한 일정 동기화, 대시보드 뷰를 통해 프로젝트의 전반적인 진행 상황을 직관적으로 파악할 수 있도록 지원합니다.

## 기술 스택

- **Backend**: Node.js, Express.js, TypeScript
- **Database / ORM**: PostgreSQL, Prisma
- **Authentication**: Passport.js (Local, Google OAuth 2.0, JWT), bcrypt
- **Validation**: Zod
- **Architecture**: Layered Architecture, Dependency Injection(DI)
- **Etc**: Git, Github, Nodemailer (이메일 발송), Multer (파일 업로드)

## 주요 기능 및 팀원별 담당

### 1. 회원 및 인증 (User & Auth)

- **JWT 및 구글 OAuth 2.0**을 활용한 안전한 로그인 및 회원가입
- 사용자 프로필 관리 및 비밀번호 암호화 (bcrypt)

### 2. 프로젝트 및 멤버 관리 (Project & Member)

- **프로젝트 관리**: 프로젝트 생성, 수정, 삭제 기능
- **멤버 관리 및 초대**:
    - 이메일(Nodemailer) 기반 프로젝트 멤버 초대 (소유자 권한)
    - 초대 수락/취소 및 기존 멤버 제외 기능 구현
    - 페이지네이션이 적용된 멤버 목록 조회

### 3. 할 일 및 댓글 관리 (Task & Subtask & Comment)

- **Task/Subtask CRUD**: 프로젝트 내 작업 및 세부 작업 할당, 상태 변경
- **댓글(Comment) 기능**:
    - 특정 Task에 대한 댓글 작성, 목록 조회 (프로젝트 멤버 전용)
    - 작성자 권한 검증을 통한 댓글 수정 및 삭제

### 4. 대시보드 및 통계 (Dashboard)

- 프로젝트별 업무 진행률 및 상태별 Task 통계 제공
- 대시보드 뷰를 위한 데이터 집계 및 API 제공

## 파일 및 폴더 구조

프로젝트는 관심사 분리를 위해 **Layered Architecture**를 채택하였으며, `container.ts`를 활용하여 의존성 주입(Dependency Injection)을 구현하고 있습니다.

```
NB-03-team-3-moonshot-backend
├── prisma/               # Prisma 스키마, 마이그레이션 및 시드 데이터
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── auth/             # 인증 관련 컨트롤러/서비스/라우터 (OAuth, JWT)
│   ├── user/             # 사용자 정보 관리
│   ├── project/          # 프로젝트 전반의 비즈니스 로직
│   ├── member/           # 프로젝트 내 멤버 초대 및 권한 관리 로직
│   ├── task/             # 할 일(Task) 관리
│   ├── subtask/          # 세부 할 일(Subtask) 관리
│   ├── comment/          # Task 내 댓글 관리 기능
│   ├── dashboard/        # 통계 및 대시보드 데이터 제공 로직
│   ├── lib/              # 공통 유틸리티 (prisma, token, email-service 등)
│   ├── middleware/       # 인증, 에러 처리, Zod 검증 미들웨어
│   ├── container.ts      # DI(의존성 주입) 컨테이너 설정 파일
│   └── main.ts           # 애플리케이션 진입점 (Entry Point)
├── .env                  # 환경 변수 (GitHub 제외)
├── package.json          # 프로젝트 의존성 및 스크립트
└── tsconfig.json         # TypeScript 설정
```

## 로컬 설치 및 실행 방법

1. **저장소 클론 및 패키지 설치**
    
    ```
    git clone https://github.com/JunoLee1/nb-03-team-3-moonshot-backend.git
    cd nb-03-team-3-moonshot-backend
    npm install
    ```
    
2. **환경 변수 설정**
루트 디렉토리에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다. (DB URL, JWT Secret, Google OAuth Key 등)
3. **데이터베이스 마이그레이션 및 시드 데이터 생성**
    
    ```
    npx prisma generate
    npx prisma migrate dev
    npm run seed
    ```
    
4. **개발 서버 실행**
    
    ```
    npm run dev
    ```
