/*
  Warnings:

  - Changed the type of `desired_weekly_frequency` on the `goals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."goals" DROP COLUMN "desired_weekly_frequency",
ADD COLUMN     "desired_weekly_frequency" INTEGER NOT NULL;
