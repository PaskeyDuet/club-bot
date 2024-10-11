import { NextFunction } from "grammy";
import { MyContext } from "../types/grammy.types";

export default async function (ctx: MyContext, next: NextFunction) {
  const userId = ctx.from?.id;
  console.log(userId);

  if (userId) {
    ctx.userId = userId;
  }

  await next();
}
