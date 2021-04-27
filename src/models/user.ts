import { DataTypes, Model, Optional } from "sequelize";
import db from "../db";
import IUser from "../types/IUser";
import { Todo } from "./todo";

interface UserAttributes extends IUser {
  readonly id: string;
  username: string;
  age: number;
  email: string;
  password: string;
  refreshToken?: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

export const User = db.define<UserInstance>("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  refreshToken: {
    type: DataTypes.STRING,
  },
});

// User.hasMany(Todo, { foreignKey: { name: "userId" } });

export const defineUser = async () => await User.sync({ force: true });
