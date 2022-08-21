/*
  Warnings:

  - You are about to drop the column `Date` on the `DailyDish` table. All the data in the column will be lost.
  - You are about to drop the column `Dishid` on the `DailyDish` table. All the data in the column will be lost.
  - Added the required column `dishId` to the `DailyDish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DailyDish" DROP CONSTRAINT "DailyDish_Dishid_fkey";

-- AlterTable
ALTER TABLE "DailyDish" DROP COLUMN "Date",
DROP COLUMN "Dishid",
ADD COLUMN     "date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dishId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyDish" ADD CONSTRAINT "DailyDish_dishId_fkey" FOREIGN KEY ("dishId") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
