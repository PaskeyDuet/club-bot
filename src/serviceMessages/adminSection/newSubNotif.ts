import { MyContext } from "../../types/grammy.types";

export default async function (ctx: MyContext) {
  let messageText = "Была оплачена новая подписка";
  await ctx.api.sendMessage(-1002389280014, messageText, {
    message_thread_id: 5,
  });
}
