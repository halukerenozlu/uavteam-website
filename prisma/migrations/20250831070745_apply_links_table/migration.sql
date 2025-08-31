-- CreateTable
CREATE TABLE "public"."ApplyLinks" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "mechanical" TEXT,
    "avionic" TEXT,
    "software" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplyLinks_pkey" PRIMARY KEY ("id")
);
