-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "avatar_url" TEXT NOT NULL,
    "external_account_id" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_external_account_id_key" ON "public"."users"("external_account_id");
