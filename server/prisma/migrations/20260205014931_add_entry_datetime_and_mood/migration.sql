/*
  Warnings:

  - You are about to drop the column `mood_rating` on the `entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "entries" DROP COLUMN "mood_rating",
ADD COLUMN     "mood" SMALLINT;
