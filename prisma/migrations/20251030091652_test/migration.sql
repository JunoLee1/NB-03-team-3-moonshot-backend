/*
  Warnings:

  - You are about to drop the column `profile_image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile_image",
ADD COLUMN     "profileImage" TEXT;
