import Router from "express";
import { OrderController } from "./order.controller";

const orderController = new OrderController();

export const orderRouter = Router();

orderRouter.post("/order", orderController.add); 
orderRouter.get("/orders", orderController.getAll);
orderRouter.get("/orders-userId/:id", orderController.getOrdersByUserId);
orderRouter.get("/order/:id", orderController.getOrderById);
orderRouter.put("/order/:id", orderController.updateOrder);
orderRouter.delete("/order/:id", orderController.deleteOrder);
orderRouter.get("/allOrders-period", orderController.getOrdersByPeriod);
orderRouter.post("/orders", orderController.addMany);
orderRouter.get("/userOrders-period", orderController.getUserOrdersByPeriod);
orderRouter.delete("/orders-userId", orderController.deleteByDateId);
orderRouter.put("/orders-userId", orderController.updateByDateId);