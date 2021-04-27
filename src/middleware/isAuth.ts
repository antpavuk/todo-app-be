import { Request, Response, NextFunction } from "express";
import HTTPException from "../types/HTTPException";
import jwt from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("authorization");

    if (!authHeader) {
      res.locals.isAuth = false;
      return next();
    }

    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    if (!token) {
      res.locals.isAuth = false;
      return next();
    }

    const user: any = {};

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      (err: any, decoded: any) => {
        if (err) throw new HTTPException(401);
        if (decoded) user.id = decoded.user.id;
      }
    );

    if (!user.id) throw new HTTPException(401);

    res.locals.isAuth = true;
    res.locals.userId = user.id;

    next();
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal server error.",
    });
    next(err);
  }
};
