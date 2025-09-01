-- CreateEnum
CREATE TYPE "public"."Squad" AS ENUM ('mechanical', 'avionics', 'software');

-- CreateTable
CREATE TABLE "public"."TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "squad" "public"."Squad",
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isPresident" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "linkedinUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);
