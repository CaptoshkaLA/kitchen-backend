/*
  Warnings:

  - The `Date` column on the `DailyDish` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DailyDish" DROP COLUMN "Date",
ADD COLUMN     "Date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
