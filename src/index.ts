import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import TodoRoute from "./routes/todo";
import db from "./database";
import HTTPException from "./types/HTTPException";
import UserRoute from "./routes/user";
import morgan from "morgan";
import AuthRoute from "./routes/auth";

class App {
  app: Application;
  port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4001;
    this.config();
    this.setRotes();
    this.connectToDB();
    this.start();
    this.app.use(this.errorHandler);
  }

  config() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan("dev"));

    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  setRotes() {
    this.app.use("/api/auth", new AuthRoute().router);
    this.app.use("/api/todos", new TodoRoute().router);
    this.app.use("/api/users", new UserRoute().router);
  }

  async connectToDB() {
    try {
      await db.sync();
    } catch (err) {
      this.app.use((next: NextFunction) => next(err));
    }
  }

  errorHandler(
    err: HTTPException,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.statusCode || 500);
    res.render("error", { error: err });
  }

  start() {
    this.app.listen(this.port);
  }
}

new App();
