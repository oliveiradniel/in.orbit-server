-- CreateTable
CREATE TABLE "public"."Goals" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "desired_weekly_frequency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);
