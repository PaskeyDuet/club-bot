import { Sequelize } from "sequelize-typescript";
import User from "./models/User.js";
import Subscription from "./models/UserSubscription.js";
import SubDetails from "./models/SubDetails.js";
import Meetings from "./models/Meetings.js";
import MeetingsDetails from "./models/MeetingsDetails.js";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.js";
import UserSubscription from "./models/UserSubscription.js";
import MeetingsVocabulary from "./models/MeetingsVocabulary.js";
import VocabularyTags from "./models/VocabularyTags.js";
import GroupsMembers from "./models/GroupsMembers.js";
import UsersGroups from "./models/UsersGroups.js";
import sanitizedConfig from "#root/config.js";

export let sequelize: Sequelize;

try {
  const env = sanitizedConfig;
  const dbObj = {
    database: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: +env.DB_PORT,
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
      GroupsMembers,
      UsersGroups,
    ],
  });

  User.hasOne(Subscription, { foreignKey: "user_id" });
  User.hasMany(MeetingsDetails, { foreignKey: "user_id" });
  User.hasMany(GroupsMembers, { foreignKey: "user_id" });
  SubDetails.hasMany(Subscription, { foreignKey: "sub_number" });
  Meetings.hasMany(MeetingsDetails, { foreignKey: "meeting_id" });
  Meetings.hasMany(MeetingsVocabulary, { foreignKey: "meeting_id" });
  VocabularyTags.hasMany(MeetingsVocabulary, { foreignKey: "tag_id" });
  UsersGroups.hasMany(GroupsMembers, { foreignKey: "group_id" });
} catch (err) {
  logErrorAndThrow(err, "fatal", "can't connect to database");
}
