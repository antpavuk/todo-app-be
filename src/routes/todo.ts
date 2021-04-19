import { Router } from "express";
import TodoController from "../controllers/todos";

export default class TodoRoute {
  router: Router;

  constructor() {
    this.router = Router();
    this.setPaths();
  }

  setPaths() {
    this.router.post("/", TodoController.addTodo);
    this.router.get("/", TodoController.getTodos);
    this.router.put("/:id", TodoController.updateTodo);
    this.router.put("/", TodoController.updateTodos);
    this.router.delete("/:id", TodoController.deleteTodo);
    this.router.delete("/", TodoController.deleteTodos);
  }
}
