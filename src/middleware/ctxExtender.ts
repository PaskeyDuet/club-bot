import { NextFunction } from "grammy";
import { MyContext } from "../types/grammy.types";

export default async function (ctx: MyContext, next: NextFunction) {
  const userId = ctx.message?.from.id;
  if (userId) {
    ctx.userId = userId;
  }

  await next();
}
