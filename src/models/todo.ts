import { DataTypes, Model, Optional } from "sequelize";
import db from "../db";
import { User } from "./user";

// class TodoModel extends Model {
//   public readonly id!: string;
//   public content!: string;
//   public activity_status!: string | null;
// }

interface TodoAttributes {
  id: string;
  content: string;
  activity_status: boolean;
  userId: string;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, "id"> {}

interface TodoInstance
  extends Model<TodoAttributes, TodoCreationAttributes>,
    TodoAttributes {}

export const Todo = db.define<TodoInstance>("todo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activity_status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
});

export const defineTodo = async () => await Todo.sync({ force: true });
