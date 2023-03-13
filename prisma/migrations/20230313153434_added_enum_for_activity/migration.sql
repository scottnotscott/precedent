-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('IDLE', 'TRAINING', 'COMBAT');

-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "activity" "Activity" NOT NULL DEFAULT 'IDLE';
