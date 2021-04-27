import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import HTTPException from "../types/HTTPException";
import IUser from "../types/IUser";
import { Op } from "sequelize";
import setTokens from "../utils/setTokens";
import jwt from "jsonwebtoken";

export default class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, age } = req.body;

      const users: IUser[] = [];
      (
        await User.findAll({
          where: {
            [Op.or]: [
              { username: { [Op.eq]: username } },
              { email: { [Op.eq]: email } },
            ],
          },
          order: [["createdAt", "DESC"]],
        })
      ).forEach(user => users.push(user as IUser));

      if (!!users.length)
        throw new HTTPException(
          401,
          "User with such email or username already exists!"
        );

      const salt = await bcrypt.genSalt(parseInt(process.env.SALT!));
      const encryptedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        email,
        password: encryptedPassword,
        username,
        age: parseInt(age),
      });

      const { token, refreshToken } = setTokens(newUser.id);

      newUser.refreshToken = refreshToken;
      await newUser.save();

      res.status(201).json({ token, refreshToken });

      next();
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async logIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) throw new HTTPException(401, "Email is incorrect!");

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect)
        throw new HTTPException(401, "Password is incorrect!");

      const { token, refreshToken } = setTokens(user.id);

      user.refreshToken = refreshToken;

      await user.save();

      res.status(200).json({ token, refreshToken });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;

      if (!isAuth || !userId)
        throw new HTTPException(400, "Impossible to specify user to log out");

      const [updatedNumber] = await User.update(
        { refreshToken: null },
        { where: { id: userId } }
      );

      if (!updatedNumber) throw new HTTPException(501, "Log out failed");

      res.status(200).json({ message: "Logged out succesfully" });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const authenticationError = new HTTPException(
        403,
        "Authentication failed!"
      );

      const user: any = {};

      jwt.verify(
        refreshToken,

        process.env.REFRESH_TOKEN_SECRET!,
        (err: any, decoded: any) => {
          if (err) throw authenticationError;
          if (decoded) user.id = decoded.user.id;
        }
      );

      if (!user) throw authenticationError;

      const { id } = user;
      const { token, refreshToken: newRefreshToken } = setTokens(id);

      const [updatedNumber] = await User.update(
        { refreshToken: newRefreshToken },
        { where: { id } }
      );

      if (!updatedNumber) throw authenticationError;

      res.status(201).json({ token, refreshToken: newRefreshToken });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }
}
