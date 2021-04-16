import { createServer, IncomingMessage, ServerResponse } from "http";
import * as dotenv from "dotenv";
import {
  addTodo,
  deleteTodo,
  deleteTodos,
  getTodos,
  updateTodo,
  updateTodos,
} from "./controllers/todos";
import { URL, URLSearchParams } from "url";
import HTTPMethods from "./types/HTTPMethods";
import uuidMatch from "./utils/uuidMatch";
dotenv.config();

const router = async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
  );
  res.setHeader("Content-Type", "application/x-www-form-urlencoded");

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Max-Age": 2592000,
    });
    res.end();
    return;
  }

  console.log(req.url);
  try {
    const { method, url } = req;
    const baseUrl = "/api/todos";

    if (url?.startsWith(baseUrl)) {
      const urlIDParameter =
        url?.split("/").length > 3 ? url?.split("/")[3] : "";

      const urlIDParameterMatches = uuidMatch(urlIDParameter);

      if (method === HTTPMethods.GET && url === baseUrl) {
        await getTodos(req, res);
      } else if (method === HTTPMethods.POST && url === baseUrl) {
        await addTodo(req, res);
        console.log(url);
      } else if (method === HTTPMethods.PUT && urlIDParameterMatches) {
        await updateTodo(req, res, urlIDParameter);
      } else if (method === HTTPMethods.PUT) {
        await updateTodos(req, res);
      } else if (method === HTTPMethods.DELETE && urlIDParameterMatches) {
        await deleteTodo(req, res, urlIDParameter);
      } else if (method === HTTPMethods.DELETE) {
        await deleteTodos(req, res);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const server = createServer(router);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(port, process.env.NODE_ENV);
});
