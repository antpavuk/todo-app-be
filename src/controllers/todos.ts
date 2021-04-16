import { IncomingMessage, ServerResponse } from "node:http";
import Todo from "../models/todo";
import getRequestQuery from "../utils/getRequestQuery";
import isEmptyObj from "../utils/isEmptyObject";

export async function addTodo(req: IncomingMessage, res: ServerResponse) {
  try {
    let body = "";

    req
      .on("error", err => {
        console.log(err);
      })
      .on("data", chunk => {
        body += chunk.toString();
      })
      .on("end", async () => {
        const { value } = JSON.parse(body);

        const todo = Todo.create(value);

        res.writeHead(201, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ todo, message: "Todo was created" }));
      });
  } catch (error) {
    console.log(error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

export async function getTodos(req: IncomingMessage, res: ServerResponse) {
  try {
    const todos = Todo.findAll();

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ todos, message: "Todos were found" }));
  } catch (error) {
    console.log(error);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "todos are not found" }));
  }
}

export async function updateTodo(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  try {
    let body = "";
    req
      .on("error", err => {
        console.log(err);
      })
      .on("data", chunk => {
        body += chunk.toString();
      })
      .on("end", async () => {
        const todo = Todo.updateById(id, JSON.parse(body));

        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ todo, message: "Todo updated" }));
      });
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
    console.log(error);
  }
}

export async function updateTodos(req: IncomingMessage, res: ServerResponse) {
  try {
    const query = getRequestQuery(req.url!);

    if (query.action === "activate") {
      const todos = Todo.updateAll({ isActive: true });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ todos, message: "Todos were updated" }));
    } else if (query.action === "complete") {
      const todos = Todo.updateAll({ isActive: false });

      Todo.updateAll({ isActive: false });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ todos, message: "Todos were updated" }));
    } else if (isEmptyObj(query)) {
      let body = "";
      req
        .on("error", err => {
          console.log(err);
        })
        .on("data", chunk => {
          body += chunk.toString();
        })
        .on("end", async () => {
          const todos = Todo.updateAll(JSON.parse(body));

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ todos, message: "Todos were updated" })
          );
        });
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
    console.log(error);
  }
}

export async function deleteTodo(
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) {
  try {
    const todo = Todo.removeById(id);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Todo was deleted", todo }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
    console.log(error);
  }
}

export async function deleteTodos(req: IncomingMessage, res: ServerResponse) {
  try {
    const query = getRequestQuery(req.url!);

    let filter =
      query.isActive === "true" || query.isActive === "false"
        ? { ...query, isActive: JSON.parse(query.isActive) }
        : query;

    const todos = Todo.removeAll(filter);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ todos, message: "Todos were deleted" }));
  } catch (error) {
    console.log(error);

    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}
