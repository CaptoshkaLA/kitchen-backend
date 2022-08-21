import { DishMenuType } from "@prisma/client";

export interface DailyDishView {
    menuId: number;
    dishId: number;
    name: string;
    type: DishMenuType;
    category: string;
    date: string;
    price: number;
    description: string;
    pfc: string | null;
    image: string | null
}