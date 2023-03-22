-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('IDLE', 'TRAINING', 'COMBAT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hp" INTEGER NOT NULL DEFAULT 100,
    "str" INTEGER NOT NULL DEFAULT 1,
    "def" INTEGER NOT NULL DEFAULT 1,
    "mag" INTEGER NOT NULL DEFAULT 1,
    "res" INTEGER NOT NULL DEFAULT 1,
    "rng" INTEGER NOT NULL DEFAULT 1,
    "eva" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 1,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "online_status" BOOLEAN NOT NULL DEFAULT true,
    "rank" TEXT NOT NULL DEFAULT 'Student',
    "bio" TEXT NOT NULL DEFAULT 'Nothing to see here',
    "village" TEXT NOT NULL DEFAULT 'Kinyo',
    "activity" "Activity" NOT NULL DEFAULT 'IDLE',

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slot01" TEXT NOT NULL DEFAULT 'Empty',
    "slot02" TEXT NOT NULL DEFAULT 'Empty',
    "slot03" TEXT NOT NULL DEFAULT 'Empty',

    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LootTableType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LootTableType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LootTable" (
    "id" TEXT NOT NULL,
    "lootTableTypeId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "dropChance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LootTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatModifier" (
    "id" TEXT NOT NULL,
    "stat" TEXT NOT NULL,
    "modifier" INTEGER NOT NULL,

    CONSTRAINT "StatModifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "shop_value" TEXT,
    "tradeable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemStatModifiers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "UserStats_userId_key" ON "UserStats"("userId");

-- CreateIndex
CREATE INDEX "UserStats_userId_idx" ON "UserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_userId_key" ON "UserInventory"("userId");

-- CreateIndex
CREATE INDEX "UserInventory_userId_idx" ON "UserInventory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LootTableType_name_key" ON "LootTableType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemStatModifiers_AB_unique" ON "_ItemStatModifiers"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemStatModifiers_B_index" ON "_ItemStatModifiers"("B");
