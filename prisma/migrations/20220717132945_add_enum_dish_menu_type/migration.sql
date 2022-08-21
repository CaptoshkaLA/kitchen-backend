/*
  Warnings:

  - You are about to alter the column `price` on the `Dish` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Integer`.
  - A unique constraint covering the columns `[name]` on the table `Dish` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `menu_type` on the `Dish` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DishMenuType" AS ENUM ('common', 'diet', 'premium');

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "menu_type",
ADD COLUMN     "menu_type" "DishMenuType" NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Dish_name_key" ON "Dish"("name");
