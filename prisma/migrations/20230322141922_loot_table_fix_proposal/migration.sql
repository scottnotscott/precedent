-- CreateTable
CREATE TABLE "_LootTableItems" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LootTableItems_AB_unique" ON "_LootTableItems"("A", "B");

-- CreateIndex
CREATE INDEX "_LootTableItems_B_index" ON "_LootTableItems"("B");
