/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `realName` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "teamAResult" TEXT,
ADD COLUMN     "teamBResult" TEXT;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "avatarUrl",
DROP COLUMN "realName";

-- AlterTable
ALTER TABLE "PlayerStats" ALTER COLUMN "team" DROP DEFAULT;
