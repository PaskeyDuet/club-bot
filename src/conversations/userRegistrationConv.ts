import sendStartMessage from "../serviceMessages/sendStartMessage";
import { MyContext, MyConversation } from "../types/grammy.types";
import { DbUserAttributes } from "../dbSetup/models/User";
import dates from "../helpers/dates";
import createUserDbImage from "../dbSetup/handlers/createUserDbImage";

export default async function (conversation: MyConversation, ctx: MyContext) {
  let nameText = "Пожалуйста, напишите ваше <b>имя</b>\n";
  nameText += "<i>В дальнейшем вы сможете его изменить в меню настроек</i>";
  await ctx.reply(nameText, { parse_mode: "HTML" });
  const {
    message: { text: user_name },
  } = await conversation.waitFor("message:text", {
    otherwise: (ctx) => {
      ctx.reply("Пожалуйста, используйте текст");
    },
  });

  let secondNameText = "Пожалуйста, напишите вашу <b>фамилию</b>\n";
  secondNameText += "<i>В дальнейшем вы также сможете изменить его</i>";
  await ctx.reply(secondNameText, { parse_mode: "HTML" });
  const {
    message: { text: second_user_name },
  } = await conversation.waitFor("message:text", {
    otherwise: (ctx) => {
      ctx.reply("Пожалуйста, используйте текст");
    },
  });
  if (ctx.from?.id) {
    const newUser: DbUserAttributes = {
      user_id: ctx.from?.id,
      first_name: user_name,
      second_name: second_user_name,
      reg_date: dates.currDate(),
    };
    await createUserDbImage(newUser);
    return await sendStartMessage(ctx);
  }
}
