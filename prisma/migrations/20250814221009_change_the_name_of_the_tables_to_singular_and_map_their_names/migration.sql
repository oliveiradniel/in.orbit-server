/*
  Warnings:

  - You are about to drop the `Goals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoalsCompleted` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GoalsCompleted" DROP CONSTRAINT "GoalsCompleted_goal_id_fkey";

-- DropTable
DROP TABLE "public"."Goals";

-- DropTable
DROP TABLE "public"."GoalsCompleted";

-- CreateTable
CREATE TABLE "public"."goals" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "desired_weekly_frequency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."goals_completed" (
    "id" UUID NOT NULL,
    "goal_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goals_completed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."goals_completed" ADD CONSTRAINT "goals_completed_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
