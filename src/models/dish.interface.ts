import { DishMenuType } from "prisma/prisma-client"
import { DishCategory } from "prisma/prisma-client"
/**
 * That class implements the dish entity
 */
export interface Dish {
    id: number,
    name: string, // Contains name + menu_type. For example, "Caesar diet".
    category: DishCategory, // It stores 5 types of category: soup, garnish, meat, fish, drink
    menu_type: DishMenuType, // It stores 3 types of menus: common menu, diet and premium
    description: string,
    price: number,
    pfc?: string,
    note?: string,
    image?: string,
}