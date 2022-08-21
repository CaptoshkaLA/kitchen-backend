import { Router } from "express";
import { dishRouter } from "../controllers/dish"
import { dailyDishRouter } from "../controllers/daily-dish/index"
import {orderRouter} from "../controllers/user_order";

const api = Router()
    .use("/dish", dishRouter)
    .use("/daily", dailyDishRouter)
    .use("/userOrder", orderRouter)

export default Router().use(api);
