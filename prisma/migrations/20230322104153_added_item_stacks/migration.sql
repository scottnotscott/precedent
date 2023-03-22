/*
  Warnings:

  - The `slot01` column on the `UserInventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `slot02` column on the `UserInventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `slot03` column on the `UserInventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "stackLimit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "stackable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UserInventory" DROP COLUMN "slot01",
ADD COLUMN     "slot01" JSONB,
DROP COLUMN "slot02",
ADD COLUMN     "slot02" JSONB,
DROP COLUMN "slot03",
ADD COLUMN     "slot03" JSONB;
