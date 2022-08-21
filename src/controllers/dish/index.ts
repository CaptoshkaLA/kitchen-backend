import Router from "express";
import { DishController } from "./dish.controller";

const dishController = new DishController();

export const dishRouter = Router();

dishRouter.put("/dishes/:id", dishController.update);
dishRouter.get("/dishes", dishController.getAll);
dishRouter.get("/dishes/:id", dishController.getDishById);
dishRouter.delete("/dishes/:id", dishController.delete);
dishRouter.post("/dishes", dishController.add);