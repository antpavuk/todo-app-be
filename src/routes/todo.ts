import { Router } from "express";
import TodoController from "../controllers/todo";
import { isAuth } from "../middleware/isAuth";

export default class TodoRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.setPaths();
  }

  setPaths() {
    this.router.post("/", isAuth, TodoController.addTodo);
    this.router.get("/", isAuth, TodoController.getTodos);
    this.router.put("/:id", isAuth, TodoController.updateTodo);
    this.router.put("/", isAuth, TodoController.updateTodos);
    this.router.delete("/:id", isAuth, TodoController.deleteTodo);
    this.router.delete("/", isAuth, TodoController.deleteTodos);
  }
}
