/*
  Warnings:

  - Changed the type of `status` on the `Agent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `metrics` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('initializing', 'ready', 'running', 'stopped', 'error');

-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "status",
ADD COLUMN     "status" "AgentStatus" NOT NULL,
ALTER COLUMN "metrics" SET NOT NULL,
ALTER COLUMN "metrics" SET DEFAULT '{}',
ALTER COLUMN "config" SET DEFAULT '{}';
