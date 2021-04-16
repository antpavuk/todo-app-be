import ITodo from "../types/ITodo";
import { v4 as uuid } from "uuid";
import isEmptyObj from "../utils/isEmptyObject";

type IdLessTodoParams = {
  value?: string;
  isActive?: boolean;
};

type TodoParams = {
  id?: string;
  value?: string;
  isActive?: boolean;
};

export default class Todo {
  private static todos: ITodo[] = [];

  public static findAll(): ITodo[] {
    return this.todos;
  }

  private static setTodos(todos: ITodo[]) {
    this.todos = todos;
  }

  public static create(value: string): ITodo {
    const id = uuid();
    const todo: ITodo = {
      id,
      value,
      isActive: true,
    };

    const newTodos = [todo, ...this.todos];

    this.setTodos(newTodos);

    return todo;
  }

  public static updateById(
    id: string,
    body: IdLessTodoParams
  ): ITodo | undefined {
    let newTodo: ITodo;

    const newTodos = this.todos.map(todo => {
      if (todo.id === id) {
        newTodo = { ...todo, ...body };
        return newTodo;
      }
      return todo;
    });

    this.setTodos(newTodos);

    return newTodo!;
  }

  public static updateAll(body: IdLessTodoParams) {
    const newTodos = this.todos.map(todo => ({ ...todo, ...body }));

    this.setTodos(newTodos);

    return newTodos;
  }

  public static removeById(id: string): ITodo | undefined {
    let removedTodo: ITodo;

    const newTodos = this.todos.filter(todo => {
      if (todo.id === id) {
        removedTodo = todo;
        return false;
      }
      return true;
    });

    this.setTodos(newTodos);

    return removedTodo!;
  }

  public static removeAll(filter?: TodoParams) {
    if (!filter || isEmptyObj(filter)) {
      this.setTodos([]);
      return [];
    }

    const newTodos = this.todos.filter(
      todo =>
        (!filter.id || filter.id !== todo.id) &&
        (!filter.value || filter.value !== todo.value) &&
        (filter.isActive === undefined || filter.isActive !== todo.isActive)
    );

    this.setTodos(newTodos);

    return newTodos;
  }
}
