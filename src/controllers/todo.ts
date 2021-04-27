import { NextFunction, Request, Response } from "express";
import { Todo } from "../models/todo";
import HTTPException from "../types/HTTPException";
import ITodo from "../types/ITodo";
import clientTodoToDB from "../utils/clientTodoToDB";
import dbTodoToClient from "../utils/dbTodoToClient";

export default class TodoController {
  static async addTodo(req: Request, res: Response, next: NextFunction) {
    const { isAuth, userId } = res.locals;
    if (!isAuth || !userId) throw new HTTPException(401);
    try {
      const { value } = req.body;
      const newTodo = await Todo.create({
        content: value,
        activity_status: true,
        userId,
      });

      res.status(201).json({
        todo: dbTodoToClient(newTodo),
        message: "Todo was created",
      });

      next();
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;
      if (!isAuth || !userId) throw new HTTPException(401);

      const todos: ITodo[] = [];
      (
        await Todo.findAll({
          order: [["createdAt", "DESC"]],
          where: {
            userId,
          },
        })
      ).forEach(todo => todos.push(dbTodoToClient(todo) as ITodo));

      res.status(200).json({
        todos,
        message: "Todos fetched succesfully!",
      });

      next();
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;
      if (!isAuth || !userId) throw new HTTPException(401);
      const { id } = req.params;

      // req.body loaded with values from todo
      const bodyToUpdate = clientTodoToDB(req.body);

      const todoToUpdate = await Todo.update(bodyToUpdate, {
        where: { id, userId },
      });

      if (todoToUpdate[0] === 0)
        throw new HTTPException(404, "Todo was not found!");

      const updatedTodo = await Todo.findOne({ where: { id } });

      res.status(200).json({
        todo: dbTodoToClient(updatedTodo!),
        message: "Todo updated",
      });

      next();
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async updateTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;
      if (!isAuth || !userId) throw new HTTPException(401);
      const { action } = req.query;
      const bodyToUpdate = clientTodoToDB(req.body);

      if (action === "activate") {
        await Todo.update(
          { activity_status: true },
          { where: { activity_status: false, userId } }
        );
      } else if (action === "complete") {
        await Todo.update(
          { activity_status: false },
          { where: { activity_status: true, userId } }
        );
      } else {
        await Todo.update(bodyToUpdate, { where: { userId } });
      }

      const todos: ITodo[] = [];
      (
        await Todo.findAll({
          order: [["createdAt", "DESC"]],
          where: {
            userId,
          },
        })
      ).forEach(todo => todos.push(dbTodoToClient(todo) as ITodo));

      res.status(200).json({
        todos,
        message: "Todos updated",
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;
      if (!isAuth || !userId) throw new HTTPException(401);
      const { id } = req.params;

      const todoToDelete = await Todo.findOne({ where: { id, userId } });

      if (!todoToDelete)
        throw new HTTPException(404, "Todo was not found to delete!");

      await Todo.destroy({ where: { id } });

      res.status(200).json({
        todo: todoToDelete,
        message: "Todo deleted",
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }

  static async deleteTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAuth, userId } = res.locals;
      if (!isAuth || !userId) throw new HTTPException(401);
      const { query } = req;

      const filter: {
        content?: string;
        activity_status?: boolean | string;
      } = {};

      if (query.isActive === "true" || query.isActive === "false")
        filter.activity_status = query.isActive;

      const todosToDelete: ITodo[] = [];
      (
        await Todo.findAll({
          where: { ...filter, userId },
          order: [["createdAt", "DESC"]],
        })
      ).forEach(todo => todosToDelete.push(dbTodoToClient(todo) as ITodo));

      await Todo.destroy({ where: { ...filter } });

      const todos: ITodo[] = [];
      (
        await Todo.findAll({
          where: { userId },
          order: [["createdAt", "DESC"]],
        })
      ).forEach(todo => todos.push(dbTodoToClient(todo) as ITodo));

      res.status(200).json({
        todosToDelete,
        todos,
        message: "Todos deleted",
      });

      next();
    } catch (err) {
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error.",
      });
      next(err);
    }
  }
}
