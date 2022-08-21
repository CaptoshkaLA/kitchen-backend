
import Router from "express";
import { DailyDishController } from "./daily-dish.controller";

const dailyDishController = new DailyDishController();

export const dailyDishRouter = Router()

dailyDishRouter.post("/daily-dishes", dailyDishController.createDailyDish)
dailyDishRouter.get("/daily-dishes", dailyDishController.getDailyDishes)
dailyDishRouter.delete("/daily-dishes/:id", dailyDishController.deleteDailyDishById)
dailyDishRouter.delete("/daily-dishes", dailyDishController.deleteDailyDishByDate)
dailyDishRouter.put("/daily-dishes", dailyDishController.putDailyDish)