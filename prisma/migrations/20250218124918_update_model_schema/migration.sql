/*
  Warnings:

  - A unique constraint covering the columns `[name,version]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Model" ALTER COLUMN "apiSpec" SET DEFAULT '{}',
ALTER COLUMN "pricing" SET DEFAULT '{}',
ALTER COLUMN "stats" SET DEFAULT '{}';

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_version_key" ON "Model"("name", "version");
