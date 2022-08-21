-- CreateTable
CREATE TABLE "DailyDish" (
    "id" SERIAL NOT NULL,
    "Date" TEXT NOT NULL,
    "Dishid" INTEGER NOT NULL,

    CONSTRAINT "DailyDish_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyDish" ADD CONSTRAINT "DailyDish_Dishid_fkey" FOREIGN KEY ("Dishid") REFERENCES "Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
