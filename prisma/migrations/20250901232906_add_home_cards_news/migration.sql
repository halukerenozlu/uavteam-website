-- CreateEnum
CREATE TYPE "public"."LinkType" AS ENUM ('WEB', 'INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN', 'NEWS');

-- CreateTable
CREATE TABLE "public"."HomeCard" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(120) NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HomeCardLink" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "type" "public"."LinkType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeCardLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeCard_isActive_order_idx" ON "public"."HomeCard"("isActive", "order");

-- CreateIndex
CREATE INDEX "HomeCardLink_type_idx" ON "public"."HomeCardLink"("type");

-- CreateIndex
CREATE UNIQUE INDEX "HomeCardLink_cardId_type_key" ON "public"."HomeCardLink"("cardId", "type");

-- AddForeignKey
ALTER TABLE "public"."HomeCardLink" ADD CONSTRAINT "HomeCardLink_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."HomeCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
