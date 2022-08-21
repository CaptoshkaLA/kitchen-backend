/*
  Warnings:

  - Changed the type of `category` on the `Dish` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DishCategory" AS ENUM ('soup', 'garnish', 'meat', 'fish', 'drink');

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "category",
ADD COLUMN     "category" "DishCategory" NOT NULL;
