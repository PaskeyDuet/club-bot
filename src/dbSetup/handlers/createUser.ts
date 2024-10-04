import User, { DbUserAttributes } from "../models/User";

export default async (user: DbUserAttributes) => User.create(user);
