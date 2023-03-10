-- AlterTable
ALTER TABLE "UserStats" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT 'Nothing to see here',
ADD COLUMN     "online_status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rank" TEXT NOT NULL DEFAULT 'Student',
ADD COLUMN     "village" TEXT NOT NULL DEFAULT 'Kinyo';
