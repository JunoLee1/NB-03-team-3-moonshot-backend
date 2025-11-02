/*
  Warnings:

  - The values [todo,in_progress,done] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `status` on the `Member` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Task_status" AS ENUM ('todo', 'in_progress', 'done');

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "Member" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
COMMIT;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "status",
ADD COLUMN     "status" "Task_status" NOT NULL;

-- DropEnum
DROP TYPE "public"."status";
