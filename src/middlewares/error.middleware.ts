import HttpException from "../utils/http-exception";
import { Request, Response, NextFunction } from "express";

/**
 * Handles request errors
 * @param error
 * @param request
 * @param response
 * @param next
 */
export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || error.status || 500;

  response.status(status).send(error);
};
