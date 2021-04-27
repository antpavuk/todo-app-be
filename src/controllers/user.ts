import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import HTTPException from "../types/HTTPException";

export default class UserController {
  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;

      if (!isAuth && !userId) throw new HTTPException(401);

      const user = await User.findByPk(userId);

      if (!user) throw new HTTPException(404, "Such user doesn't exist");

      const { id, username, age } = user;

      res.status(200).json({ user: { id, username, age } });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }
}
