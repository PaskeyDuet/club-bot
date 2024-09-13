import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

const env = process.env;
const dbObj = {
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: 5432,
};

export const sequelize = new Sequelize({
  dialect: "postgres",
  ...dbObj,
  models: [__dirname + "/models"],
});
