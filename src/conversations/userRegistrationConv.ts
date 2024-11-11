import { handlersCompositions as dbHandler } from "#db/handlers/index.js";
import type { DbUserAttributes } from "#db/models/User.js";
import { dates, guardExp } from "#helpers/index.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import startHandler from "#serviceMessages/startHandler.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";

export default async function (conversation: MyConversation, ctx: MyContext) {
  try {
    const text = regTextObj();

    const user_name = await getUserInput(
      conversation,
      ctx,
      text.name,
      text.otherwise
    );

    const second_user_name = await getUserInput(
      conversation,
      ctx,
      text.secName,
      text.otherwise
    );

    guardExp(ctx.from?.id, "user_id inside userRegistrationConv");
    const newUser: DbUserAttributes = {
      user_id: ctx.from?.id,
      first_name: user_name,
      second_name: second_user_name,
      username: ctx.from?.username,
      reg_date: dates.currDate(),
    };
    await dbHandler.createUserDbImage(newUser);
    //Weak solution. FIXME
    const lastMsgId = await startHandler(ctx);
    conversation.session.lastMsgId = lastMsgId || 0;
    conversation.session.user.isNewbie = true;
  } catch (err) {
    logErrorAndThrow(err, "fatal", "error during userRegistration");
  }
}

async function getUserInput(
  conversation: MyConversation,
  ctx: MyContext,
  messageText: string,
  otherwiseText: string
) {
  await ctx.reply(messageText, { parse_mode: "HTML" });
  const { message } = await conversation.waitFor("message:text", {
    otherwise: (ctx) => {
      ctx.reply(otherwiseText);
    },
  });
  return message.text;
}

const regTextObj = (): { name: string; secName: string; otherwise: string } => {
  let name = "Пожалуйста, напишите ваше <b>имя</b>\n";
  name += "<i>В дальнейшем вы сможете его изменить в меню настроек</i>";

  let secName = "Пожалуйста, напишите вашу <b>фамилию</b>\n";
  secName += "<i>В дальнейшем вы также сможете изменить его</i>";

  const otherwise = "Пожалуйста, используйте текст";

  return { name, secName, otherwise };
};
