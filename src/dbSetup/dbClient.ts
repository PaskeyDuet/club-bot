import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./models/User";
import Subscription from "./models/Subscription";
import SubDetails from "./models/SubDetails";
import Meetings from "./models/Meetings";
import MeetingsDetails from "./models/MeetingsDetails";
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
  logging: false,
  ...dbObj,
  models: [__dirname + "/models"],
});

User.hasOne(Subscription, { foreignKey: "user_id" });
User.hasMany(MeetingsDetails, { foreignKey: "user_id" });
SubDetails.hasMany(Subscription, { foreignKey: "sub_number" });
Meetings.hasMany(MeetingsDetails, { foreignKey: "meeting_id" });
