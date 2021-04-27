import { Router } from "express";
import UserController from "../controllers/user";
import { isAuth } from "../middleware/isAuth";

export default class UserRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.setPaths();
  }

  setPaths() {
    this.router.get("/current", isAuth, UserController.getCurrentUser);
  }
}
