-- CreateEnum
CREATE TYPE "status" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('todo', 'inprogress', 'done');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "role" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "start_year" INTEGER NOT NULL,
    "start_month" INTEGER NOT NULL,
    "start_day" INTEGER NOT NULL,
    "end_year" INTEGER NOT NULL,
    "end_month" INTEGER NOT NULL,
    "end_date" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "project_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "name" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nickname_key" ON "User"("nickname");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
