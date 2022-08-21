-- DropForeignKey
ALTER TABLE "DailyDish" DROP CONSTRAINT "DailyDish_Dishid_fkey";

-- AddForeignKey
ALTER TABLE "DailyDish" ADD CONSTRAINT "DailyDish_Dishid_fkey" FOREIGN KEY ("Dishid") REFERENCES "Dish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
