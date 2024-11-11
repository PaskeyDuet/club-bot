import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./models/User";
import Subscription from "./models/UserSubscription";
import SubDetails from "./models/SubDetails";
import Meetings from "./models/Meetings";
import MeetingsDetails from "./models/MeetingsDetails";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.js";
dotenv.config();

export let sequelize: Sequelize;

try {
  const env = process.env;
  const dbObj = {
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: 5432,
  };

  sequelize = new Sequelize({
    dialect: "postgres",
    logging: false,
    ...dbObj,
    models: [__dirname + "/models"],
  });

  User.hasOne(Subscription, { foreignKey: "user_id" });
  User.hasMany(MeetingsDetails, { foreignKey: "user_id" });
  SubDetails.hasMany(Subscription, { foreignKey: "sub_number" });
  Meetings.hasMany(MeetingsDetails, { foreignKey: "meeting_id" });
} catch (err) {
  logErrorAndThrow(err, "fatal", "can't connect to database");
}
