import { Request, Response } from "express";
import * as authService from "../../services/auth.service";

export class AuthController {
  /**
   * Sign in method for user authentication and receiving jwt
   * @param req Request
   * @param res Response
   * @returns JSON with user info in case of valid input parameters
   */
  public sign_in = async (req: Request, res: Response) => {
    try {
      console.log(req.body.login);
      const user = await authService.login(req.body);
      res.cookie("acess_token", user.accessToken);
      res.status(200).json({ user });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  };
}
