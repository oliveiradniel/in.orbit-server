-- AlterTable
ALTER TABLE "public"."goals" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."goals_completed" ALTER COLUMN "goal_id" DROP NOT NULL;
