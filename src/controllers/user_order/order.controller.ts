import express, { Request, Response } from "express";
import * as orderService from "../../services/order.service";
import {UserOrder} from "prisma/prisma-client"
import {deleteOrderIdDate} from "../../services/order.service";

/*
    Get request for getOrdersByPeriod
    An example request might look like this:
    /getOrdersByPeriod?dateFrom=07/21/2020 1:00:00&dateTo=07/21/2026 1:00:00
    You can also pass values via params:
    KEY                 VALUE
    dateFrom            07/21/2020 1:00:00
    dateTo              07/21/2026 1:00:00
*/

/*
    Example for sending a simple POST/PUT request
    {
        "dishId":      1, // number, the key to getting a dish from the directory
        "userId":      1, // number
        "order_date":  "07/21/2024 04:24:37", // date in string format
        "amount":      1 // number of units of the dish
    }
*/

/*
     Example for sending a POST requst for many orders "/orders"
     {
          "userId":      1,
          "order_date":  "07/26/2022 12:00:00",
          "orderPrice": "1000",
          "orderedDishes": [
          {
             "dishId": 1,
             "dishTypeName":"soup",
             "orderedDishName": "Mushroom soup",
             "dishPrice": 1000,
             "Quantity": 2
          },
          ....
          ]
      }
 */

export class OrderController {

  /**
   * Method for creating an order
   * @param req Request
   * @param res Response
   * @returns JSON with order info in case of valid input parameters
   */
  public add = async (req: Request, res: Response) => {

    try {
      const newOrder = await orderService.createOrder({...req.body});
      res.status(201).json({newOrder});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for getting a list of all orders of all users
   * @param req Request
   * @param res Response
   * @returns JSON with orders info in case of valid input parameters
   */
  public getAll = async (req: Request, res: Response) => {

    try {
      const orders: UserOrder[] = await orderService.getAllOrders();
      res.status(200).json({orders});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for getting a list of all orders of one specific user
   * @param req Request
   * @param res Response
   * @returns JSON with orders info in case of valid input parameters
   */
  public getOrdersByUserId = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toGet: UserOrder[] = await orderService.getUserOrders(id);
      if (!toGet) {
        return res.status(404).json({ success: false, error: "Order with ID " + id + " not found." });
      }
      res.status(200).json({toGet});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for receiving an order by its id
   * @param req Request
   * @param res Response
   * @returns JSON with order info in case of valid input parameters
   */
  public getOrderById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toGet: UserOrder = await orderService.getUserOrder(id);
      if (!toGet) {
        return res.status(404).json({ success: false, error: "Order with ID " + id + " not found." });
      }
      res.status(200).json({toGet});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for changing order fields
   * @param req Request
   * @param res Response
   * @returns JSON with order info in case of valid input parameters
   */
  public updateOrder = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    console.log(req.body.name);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const old: UserOrder = await orderService.getUserOrder(id);
      if (old) {
        const updatedOrder = await orderService.updateOrder(id, req.body);
        return res.status(200).json({updatedOrder});
      }
      res.status(404).json({ success: false, error: "Order with ID " + id + " not found." });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for deleting a user's order
   * @param req Request
   * @param res Response
   * @returns JSON with order info in case of valid input parameters
   */
  public deleteOrder = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toDelete: UserOrder = await orderService.deleteOrder(id);
      if (!toDelete) {
        return res.status(404).json({ success: false, error: "Recipe with ID " + id + " not found." });
      }
      res.status(200).json({toDelete});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for getting a list of all user orders in the specified period
   * @param req Request
   * @param res Response
   * @returns JSON with orders info in case of valid input parameters
   */
  public getOrdersByPeriod = async (req: Request, res: Response) => {
    const dateFrom: Date = new Date(req.query.dateFrom.toString());
    const dateTo: Date = new Date(req.query.dateTo.toString());
    try {
      const toGet: UserOrder[] = await orderService.getOrdersByDate(dateFrom, dateTo);
      if (!toGet) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }
      res.status(200).json({toGet});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for adding a list of all user orders for a given date
   * @param req Request
   * @param res Response
   * @returns JSON with info in case of valid input parameters
   */
  public addMany = async (req: Request, res: Response) => {

    try {
      const userId = req.body.userId;
      const order_date = req.body.order_date;
      const orders = req.body.orderedDishes;
      const newOrder = await orderService.createOrders(userId, order_date, orders);
      res.status(201).json(newOrder);
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for getting a list of given user orders for a given date
   * @param req Request
   * @param res Response
   * @returns JSON with info in case of valid input parameters
   */
  public getUserOrdersByPeriod = async (req: Request, res: Response) => {
    const dateFrom: Date = new Date(req.query.dateFrom.toString());
    const dateTo: Date = new Date(req.query.dateTo.toString());
    const userId: number = parseInt(String(req.query.userId));
    try {
      const toGet = await orderService.getUserOrdersByDate(dateFrom, dateTo, userId);
      if (!toGet) {
        return res.status(404).json({ success: false, error: "Order not found." });
      }
      res.status(200).json({toGet});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for delete orders by given date and userId
   * @param req Request
   * @param res Response
   * @returns JSON with info in case of valid input parameters
   */
  public deleteByDateId = async (req: Request, res: Response) => {
    const userId: number = parseInt(req.body.id);
    const date: Date = new Date(req.body.date);
    if (!userId) {
      return res.status(400).json("Id must be integer");
    }
    try {
      const toDelete: number = parseInt(await orderService.deleteOrderIdDate(userId, date));
      if (!toDelete) {
        return res.status(404).json({ success: false, error: "Order with ID " + userId + " not found." });
      }
      res.status(200).json({ success: false, error: "Records with userId " + userId + " and date " + date + " deleted successful" });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for update some user orders for a given date and userId
   * @param req Request
   * @param res Response
   * @returns JSON with info in case of valid input parameters
   */
  public updateByDateId = async (req: Request, res: Response) => {
    const date: Date = new Date(req.query.date.toString());
    const userId: number = parseInt(String(req.query.userId));
    if (!userId) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toUpdate = await orderService.updateOrderIdDate(userId, date, req.body);
      if (!toUpdate) {
        return res.status(404).json({toUpdate});
      }
      res.status(200).json({ success: false, error: "Records with userId " + userId + " and date " + date + " updated successful" });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };
}