import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import db from "../database";

class TodoModel extends Model {
  public readonly id!: string;
  public content!: string;
  public activity_status!: string | null;
}

interface TodoAttributes {
  id: string;
  content: string;
  activity_status: boolean;
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
});

export const defineTodo = async () => await TodoModel.sync({ force: true });
