/*
  Warnings:

  - You are about to drop the column `mood_rating` on the `entries` table. All the data in the column will be lost.
  - Added the required column `entry_datetime` to the `entries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "entries" DROP COLUMN "mood_rating",
ADD COLUMN     "entry_datetime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mood" SMALLINT;
