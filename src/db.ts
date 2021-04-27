import { Sequelize } from "sequelize";

const proConfig = process.env.DATABASE_URL;

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

let connectionString =
  process.env.NODE_ENV === "production" ? proConfig : devConfig;

const db = new Sequelize(connectionString!);

export default db;
