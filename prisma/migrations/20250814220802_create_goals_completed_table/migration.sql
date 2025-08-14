-- CreateTable
CREATE TABLE "public"."GoalsCompleted" (
    "id" UUID NOT NULL,
    "goal_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalsCompleted_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GoalsCompleted" ADD CONSTRAINT "GoalsCompleted_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."Goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
