import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "./models/User.js";
import Subscription from "./models/UserSubscription.js";
import SubDetails from "./models/SubDetails.js";
import Meetings from "./models/Meetings.js";
import MeetingsDetails from "./models/MeetingsDetails.js";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.js";
import UserSubscription from "./models/UserSubscription.js";
import MeetingsVocabulary from "./models/MeetingsVocabulary.js";
import VocabularyTags from "./models/VocabularyTags.js";
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
    models: [
      Meetings,
      MeetingsDetails,
      SubDetails,
      User,
      UserSubscription,
      VocabularyTags,
      MeetingsVocabulary,
    ],
  });

  User.hasOne(Subscription, { foreignKey: "user_id" });
  User.hasMany(MeetingsDetails, { foreignKey: "user_id" });
  SubDetails.hasMany(Subscription, { foreignKey: "sub_number" });
  Meetings.hasMany(MeetingsDetails, { foreignKey: "meeting_id" });
  Meetings.hasMany(MeetingsVocabulary, { foreignKey: "meeting_id" });
  VocabularyTags.hasMany(MeetingsVocabulary, { foreignKey: "tag_id" });
} catch (err) {
  logErrorAndThrow(err, "fatal", "can't connect to database");
}
