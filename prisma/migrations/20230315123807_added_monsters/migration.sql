-- CreateEnum
CREATE TYPE "Monster_type" AS ENUM ('MELEE', 'RANGED', 'MAGIC');

-- CreateEnum
CREATE TYPE "Monster_rarity" AS ENUM ('NORMAL', 'RARE', 'MAGIC', 'EXOTIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "Monster_affix" AS ENUM ('NONE', 'BERSERK', 'BRUTE', 'ANCIENT', 'NIMBLE');

-- CreateEnum
CREATE TYPE "Item_loot_table" AS ENUM ('GLOBAL', 'NORMAL', 'RARE', 'EXOTIC');

-- CreateTable
CREATE TABLE "Monsters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "monster_type" "Monster_type" NOT NULL DEFAULT 'MELEE',
    "monster_rarity" "Monster_rarity" NOT NULL DEFAULT 'NORMAL',
    "monster_affix" "Monster_affix" NOT NULL DEFAULT 'NONE',
    "image" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "base_hp" INTEGER NOT NULL DEFAULT 100,
    "base_str" INTEGER NOT NULL DEFAULT 1,
    "base_def" INTEGER NOT NULL DEFAULT 1,
    "base_mag" INTEGER NOT NULL DEFAULT 1,
    "base_res" INTEGER NOT NULL DEFAULT 1,
    "base_rng" INTEGER NOT NULL DEFAULT 1,
    "base_eva" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "currency_reward" INTEGER NOT NULL DEFAULT 10,
    "item_loot_table" "Item_loot_table" NOT NULL DEFAULT 'GLOBAL',
    "xp_reward" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "Monsters_pkey" PRIMARY KEY ("id")
);
