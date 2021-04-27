import { Router } from "express";
import AuthController from "../controllers/auth";
import TodoController from "../controllers/todo";
import { checkUserDataValidity } from "../middleware/checkUserDataValidity";
import { isAuth } from "../middleware/isAuth";

export default class AuthRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.setPaths();
  }

  setPaths() {
    this.router.post("/signup", checkUserDataValidity, AuthController.signUp);
    this.router.put("/login", checkUserDataValidity, AuthController.logIn);
    this.router.put("/logout", isAuth, AuthController.logOut);
    this.router.post("/refresh", AuthController.refresh);
  }
}
