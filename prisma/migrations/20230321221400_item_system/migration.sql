/*
  Warnings:

  - Added the required column `rarity` to the `LootTable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'JACKPOT');

-- AlterTable
ALTER TABLE "LootTable" ADD COLUMN     "rarity" "Rarity" NOT NULL;
