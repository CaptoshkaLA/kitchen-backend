import { Dish } from "../models/dish.interface"
import { prisma } from "../../prisma/prisma-client";

/**
 * Gets an array of all dishes
 * @returns Dishes[] a list of all Recipes.
 */
export const getAll = async (): Promise<Dish[]> => {
    const dish = await prisma.dish.findMany({});
    return dish;
};

/**
 * Finds a dish by ID
 * @param id of dish
 * @returns Dish
 */
export const get = async (id: number): Promise<Dish> => {
    try {
        const dish = await prisma.dish.findUnique({
            where: {
                id: id
            }
        });
        return dish;
    } catch (e) {
        return null;
    }
};

export const create = async (newDish: Dish): Promise<Dish> => {
    const dish = await prisma.dish.create({
        data: newDish,
    });
    return dish;
};

export const update = async (id: number, update: Dish): Promise<Dish> => {
    const updated = await prisma.dish.update({
        where: {
            id: id
        },
        data: update
    });
    return updated;
};

export const remove = async (id: number): Promise<Dish> => {
    try {
        const dish = await prisma.dish.delete({
            where: {
                id: id
            }
        });
        return dish;
    } catch (e) {
        return null;
    }
};