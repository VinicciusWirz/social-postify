/*
  Warnings:

  - You are about to drop the column `text` on the `Media` table. All the data in the column will be lost.
  - Added the required column `username` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "text",
ADD COLUMN     "username" TEXT NOT NULL;
