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

    CONSTRAINT "UserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slot01" TEXT NOT NULL,
    "slot02" TEXT NOT NULL,
    "slot03" TEXT NOT NULL,

    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserStats_userId_idx" ON "UserStats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInventory_userId_key" ON "UserInventory"("userId");

-- CreateIndex
CREATE INDEX "UserInventory_userId_idx" ON "UserInventory"("userId");
