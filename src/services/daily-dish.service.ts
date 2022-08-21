
import { DailyDishView } from "../models/daily-dish.view";
import { prisma } from "../../prisma/prisma-client";
import { DailyDishPostParams } from "../models/daily-dish-post.params";
import { DailyDishGetQueryParams } from "../models/daily-dish-get-dates.params";
import { DailyDishPutParams } from "../models/daily-dish-put.params";

/**
   * Method for parsing UTC date to local ISO8601
   * @param date Date in UTC format
   * @returns local ISO8601 string
   */
export const toISOLocal = (date: Date) => {
    var z = n => ('0' + n).slice(-2);
    var zz = n => ('00' + n).slice(-3);
    var off = date.getTimezoneOffset();
    var sign = off > 0 ? '-' : '+';
    off = Math.abs(off);

    return date.getFullYear() + '-'
        + z(date.getMonth() + 1) + '-' +
        z(date.getDate()) + 'T' +
        z(date.getHours()) + ':' +
        z(date.getMinutes()) + ':' +
        z(date.getSeconds()) + '.' +
        zz(date.getMilliseconds()) +
        sign + z(off / 60 | 0) + ':' + z(off % 60);
}

/**
   * Create DailyDish by Dish Ids and Date
   * @param dailyDishes interface with Dishids field and Date Field
   * @returns Promise with array of DailyDishView interface for frontend
   */
export const createDailyDish = async (dailyDishes: DailyDishPostParams): Promise<DailyDishView[]> => {
    const dishArray: DailyDishView[] = []
    const size = dailyDishes.ids.length
    for (let i: number = 0; i < size; i++) {
        const existingDailyDish = await prisma.dailyDish.findFirst({
            where: {
                dishId: dailyDishes.ids[i],
                date: toISOLocal(new Date(dailyDishes.date))
            },
        })
        if (!existingDailyDish) {
            const dailyDish = await prisma.dailyDish.create({
                data: {
                    date: toISOLocal(new Date(dailyDishes.date)),
                    dish: { connect: { id: dailyDishes.ids[i] } }
                }
            })
            const dish = await prisma.dish.findFirst({
                where: {
                    id: (await dailyDish).dishId
                },
                select: {
                    id: true,
                    name: true,
                    menu_type: true,
                    category: true,
                    price: true,
                    description: true,
                    pfc: true,
                    image: true
                }
            })
            const view: DailyDishView = {
                menuId: (await dailyDish).id,
                dishId: (await dish).id,
                name: (await dish).name,
                type: (await dish).menu_type,
                category: (await dish).category,
                date: toISOLocal((await dailyDish).date),
                price: (await dish).price,
                description: (await dish).description,
                pfc: (await dish).pfc,
                image: (await dish).image
            }
            dishArray.push(view)
        }
    }
    return dishArray
}

/**
   * Get DailyDish Array by range of Date
   * @param dates interface with fields of Date range
   * @returns Promise with array of DailyDishView interface for frontend
   */
export const getByDate = async (dates: DailyDishGetQueryParams): Promise<DailyDishView[]> => {
    if (!dates.dateFrom || !dates.dateTo) {
        throw new Error("Invalid Date")
    }
    if (dates.dateTo < dates.dateFrom) {
        throw new Error("Invalid range of Date")
    }
    const dishes = await prisma.dailyDish.findMany({
        where: {
            date:
            {
                gte: dates.dateFrom,
                lte: dates.dateTo
            }
        },
        select: {
            id: true,
            dish: {
                select: {
                    id: true,
                    name: true,
                    category: true,
                    menu_type: true,
                    price: true,
                    description: true,
                    pfc: true,
                    image: true
                }
            },
            date: true
        }
    })
    const dishArray: DailyDishView[] = dishes.map((dailyDish) => {
        return {
            menuId: dailyDish.id, dishId: dailyDish.dish.id, name: dailyDish.dish.name,
            type: dailyDish.dish.menu_type, category: dailyDish.dish.category, date: toISOLocal(dailyDish.date),
            description: dailyDish.dish.description, pfc: dailyDish.dish.pfc, price: dailyDish.dish.price,
            image: dailyDish.dish.image
        }
    })
    return dishArray

}

/**
   * Delete DailyDish by id 
   * @param dailyDishId DishId of deleting DailyDish
   * @returns Promise with DailyDishView interface for frontend
   */
export const deleteDailyDishById = async (dailyDishId: number) => {
    if (Number.isNaN(dailyDishId)) {
        throw new Error("Invalid id")
    }
    try {
        const deletedDailyDish = await prisma.dailyDish.delete({
            where: {
                id: dailyDishId
            },
            select: {
                id: true,
                dish: {
                    select: {
                        id: true,
                        name: true,
                        menu_type: true,
                        category: true,
                        price: true,
                        description: true,
                        pfc: true,
                        image: true
                    }
                },
                date: true
            }
        })
    } catch (e) {
        throw new Error("Prisma error")
    }
}

/**
   * Delete all DailyDish in range of Date
   * @param dates array of DateFrom field deleting and DateTo field deleting 
   * @returns Promise with number of deleting DailyDishes
   */
export const deleteDailyDishByDate = async (dates: Date[]): Promise<number> => {
    if (!dates[0] && !dates[1]) {
        throw new Error("Invalid date")
    }
    if (dates[1] < dates[0]) {
        throw new Error("Invalid range of Date")
    }
    try {
        const deletedDailyDishes = await prisma.dailyDish.deleteMany({
            where: {
                date: {
                    gte: dates[0],
                    lte: dates[1]
                }
            },
        })
        return deletedDailyDishes.count
    } catch (e) {
        throw new Error("Prisma error")
    }
}


/**
   * Update DailyDish menu with new Dishes by deleting olders
   * @param dailyDishes interface with Dishids field and Date Field
   * @returns Promise with DailyDishView interface for frontend
   */
export const putDailyDish = async (dailyDishes: DailyDishPutParams): Promise<DailyDishView[]> => {
    const dishArray: DailyDishView[] = [];
    const deleteDailyDishes = await prisma.dailyDish.deleteMany({
        where: {
            date: toISOLocal(new Date(dailyDishes.date))
        },
    })
    const size = dailyDishes.ids.length
    for (let i: number = 0; i < size; i++) {
        const dailyDish = prisma.dailyDish.create({
            data: {
                date: toISOLocal(new Date(dailyDishes.date)),
                dish: { connect: { id: dailyDishes.ids[i] } }
            }
        })
        const dish = prisma.dish.findFirst({
            where: {
                id: (await dailyDish).dishId
            },
            select: {
                id: true,
                name: true,
                menu_type: true,
                category: true,
                price: true,
                description: true,
                pfc: true,
                image: true
            }
        })
        const view: DailyDishView = {
            menuId: (await dailyDish).id,
            dishId: (await dish).id,
            name: (await dish).name,
            type: (await dish).menu_type,
            category: (await dish).category,
            date: (await dailyDish).date.toString(),
            price: (await dish).price,
            description: (await dish).description,
            pfc: (await dish).pfc,
            image: (await dish).image
        }
        dishArray.push(view)
    }
    return dishArray
}