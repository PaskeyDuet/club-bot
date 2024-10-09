import User from "../models/User";

export default async function (userId: number): Promise<User | null> {
  return await User.findOne({ where: { user_id: userId } });
}
