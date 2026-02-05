/*
  Warnings:

  - You are about to drop the column `mood` on the `entries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "entries" DROP COLUMN "mood",
ADD COLUMN     "mood_rating" SMALLINT;
