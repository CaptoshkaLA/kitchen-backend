import jwt from "jsonwebtoken";
import { UserInfo } from "../models/user.info";

/**
 * function generating jwt token with UserInfo model parameters in payload
 * @param user UserInfo model
 * @returns string with value of generated token
 */
const generateToken = (user: UserInfo): string => {
  return jwt.sign(user, process.env.JWT_secret, {
    expiresIn: process.env.JWT_expire,
  });
};
export default generateToken;
