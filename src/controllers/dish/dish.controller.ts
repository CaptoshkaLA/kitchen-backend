import express, { Request, Response } from "express";
import {Dish} from "../../models/dish.interface"
import * as dishService from "../../services/dish.service";

/**
 * Example for POST/PUT/DELETE requests
 * {
 *     "name": "Mushroom soup PREMIUM", // must be unique string
 *     "category": "soup", // string
 *     "menu_type": "PREMIUM", // enum type (PREMIUN or DIET or COMMON)
 *     "description": "...", // string
 *     "price": 100, // integer
 *     "pfc": "...", // string
 *     "note": "...", // string
 *     "image": "..." // string contains a BASE64 value
 * }
 */

export class DishController {

  /**
   * Method for changing one dish by id
   * @param req Request
   * @param res Response
   * @returns JSON with dish info in case of valid input parameters
   */
  public update = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({success: false, error: "Id must be integer"});
    }
    try {
      const old: Dish = await dishService.get(id);
      if (old) {
        const updatedDish = await dishService.update(id, req.body);
        return res.status(200).json({updatedDish});
      }
      res.status(404).json({success: false, error: "Dish with ID " + id + " not found."});
    } catch (e) {
      res.status(500).json({success: false, error: e.message});
    }
  };

  /**
   * Method for getting all dishes
   * @param req Request
   * @param res Response
   * @returns JSON with info of all dishes in case of valid input parameters
   */
  public getAll = async (req: Request, res: Response) => {
    try {
      const dishes: Dish[] = await dishService.getAll();
      res.status(200).json({dishes});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for getting one dish by id
   * @param req Request
   * @param res Response
   * @returns JSON with dish info in case of valid input parameters
   */
  public getDishById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toGet: Dish = await dishService.get(id);
      if (!toGet) {
        return res.status(404).json({ success: false, error: "Dish with ID " + id + " not found." });
      }
      res.status(200).json({toGet});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for delete one dish by id
   * @param req Request
   * @param res Response
   * @returns JSON with dish info in case of valid input parameters
   */
  public delete = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: "Id must be integer" });
    }
    try {
      const toDelete: Dish = await dishService.remove(id);
      if (!toDelete) {
        return res.status(404).send({ success: false, error: "Dish with ID " + id + " not found." });
      }
      res.status(200).json({toDelete});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };

  /**
   * Method for posting one dish
   * @param req Request
   * @param res Response
   * @returns JSON with dish info in case of valid input parameters
   */
  public add = async (req: Request, res: Response) => {
    try {
      if (req.body.name == null) {
        return res.status(400).json({ success: false, error: "Missing required parameter: name" });
      }
      const newDish = await dishService.create({...req.body});
      res.status(201).json({newDish});
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };
}