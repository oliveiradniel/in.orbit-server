-- DropForeignKey
ALTER TABLE "public"."goals" DROP CONSTRAINT "goals_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
