import { Request, Response } from "express";
import { DailyDishGetQueryParams } from "../../models/daily-dish-get-dates.params";
import { DailyDishPostParams } from "../../models/daily-dish-post.params";
import { DailyDishView } from "../../models/daily-dish.view";
import *  as dailyDishService from '../../services/daily-dish.service'

export class DailyDishController {

    /**
       * Method for creating DailyDish fields on specified date  with DishId
       * @param req Request
       * @param res Response
       * @returns JSON with created dishes info 
       */
    public createDailyDish = async (req: Request, res: Response) => {
        try {
            const dishes = await dailyDishService.createDailyDish(req.body)
            return res.status(201).json({ status: 201, success: true, data: dishes })
        } catch (e) {
            return res.status(400).json({ status: 400, success: false, error: e.message });
        }
    }

    /**
   * Method for getting DailyDish field by specified Date
   * @param req Request
   * @param res Response
   * @returns JSON with dishes info on passed Date 
   */
    public getDailyDishes = async (req: Request, res: Response) => {
        try {
            const dateFrom: Date = new Date(req.query.dateFrom.toString())
            const dateTo: Date = new Date(req.query.dateTo.toString())
            const dishes = await dailyDishService.getByDate({ dateFrom, dateTo })
            return res.status(200).json({ status: 200, success: true, data: dishes })
        } catch (e) {
            return res.status(400).json({ status: 400, success: false, error: e.message })
        }
    }

    /**
   * Method for deleting DailyDish fields by DishId
   * @param req Request
   * @param res Response
   * @returns JSON with deleted DailyDish
   */
    public deleteDailyDishById = async (req: Request, res: Response) => {
        try {
            await dailyDishService.deleteDailyDishById(+req.params.id)
            return res.status(204)
        } catch (e) {
            return res.status(400).json({ status: 400, success: false, error: e.message })
        }
    }

    /**
   * Method for deleting DailyDish by specified range of Date
   * @param req Request
   * @param res Response
   * @returns JSON with number of deleted dishes
   */
    public deleteDailyDishByDate = async (req: Request, res: Response) => {
        try {
            const dateFrom: Date = new Date(req.query.dateFrom.toString())
            const dateTo: Date = new Date(req.query.dateTo.toString())
            const countDeletedDishes: number = await dailyDishService.deleteDailyDishByDate([dateFrom, dateTo])
            if (countDeletedDishes !== 0)
                return res.status(204).json({ status:204,success: true, message: `${countDeletedDishes} dishes from daily dishes was deleted successfully` })
            return res.status(404).json({status:404,success:false,message:"No deleted dishes"})
        }
        catch (e) {
            return res.status(400).json({ status:400,success: false, error: e.message })
        }
    }


    /**
   * Method for updating DailyDishes menu with new list
   * @param req Request
   * @param res Response
   * @returns JSON with new list of dishes
   */
    public putDailyDish = async (req: Request, res: Response) => {
        try {
            const dishes: DailyDishView[] = await dailyDishService.putDailyDish(req.body)
            return res.status(201).json({status:201,success:true,data:dishes})
        } catch (e) {
            return res.status(400).json({ status:400,success: false, error: e.message })
        }
    }

}