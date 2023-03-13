-- CreateTable
CREATE TABLE "ServerInformation" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '0.01',

    CONSTRAINT "ServerInformation_pkey" PRIMARY KEY ("id")
);
