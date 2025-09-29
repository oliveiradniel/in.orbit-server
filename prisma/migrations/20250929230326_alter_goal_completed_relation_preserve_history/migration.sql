-- DropForeignKey
ALTER TABLE "public"."goals_completed" DROP CONSTRAINT "goals_completed_goal_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."goals_completed" ADD CONSTRAINT "goals_completed_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
