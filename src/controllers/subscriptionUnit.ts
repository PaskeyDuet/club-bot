import { subKeyboard } from "../keyboards/subKeyboards";
import { MyContext } from "../types/grammy.types";

export async function sendSubMessage(ctx: MyContext) {
  const isNewbie = ctx.session.user.isNewbie;

  if (isNewbie) {
    await ctx.conversation.enter("newbieSubConv");
  } else {
    await ctx.conversation.enter("subConv");
  }
}
