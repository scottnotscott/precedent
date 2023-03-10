/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserStats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserInventory" ALTER COLUMN "slot01" SET DEFAULT 'Empty',
ALTER COLUMN "slot02" SET DEFAULT 'Empty',
ALTER COLUMN "slot03" SET DEFAULT 'Empty';

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");
