import express, { Application } from "express";
import helmet from "helmet";
import "dotenv/config";
import cors from "cors";
import TodoRoute from "./routes/todo";
import db from "./database";
import { defineTodo } from "./models/todo";

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
  }

  config() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  setRotes() {
    this.app.use("/api/todos", new TodoRoute().router);
  }

  async connectToDB() {
    try {
      const res = await db.sync();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  start() {
    defineTodo();
    this.app.listen(this.port);
  }
}

new App();
