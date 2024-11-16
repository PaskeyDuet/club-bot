import usersController from "#db/handlers/usersController.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import startHandler from "#serviceMessages/startHandler.js";
import { MyContext, MyConversation } from "#types/grammy.types.js";
import unlessActions from "./helpers/unlessActions.js";

export default async function changeName(
  conversation: MyConversation,
  ctx: MyContext
) {
  const questions = ["Напишите ваше имя", "Напишите вашу фамилию"];
  const answers = [];
  for await (const question of questions) {
    await ctx.reply(question);

    const { message } = await conversation.waitFor(":text", {
      otherwise: (ctx) =>
        unlessActions(
          ctx,
          async () => await ctx.reply("Для ответа используйте текст")
        ),
    });
    answers.push(message?.text);
  }
  const [first_name, second_name] = answers;
  await conversation.external(() =>
    usersController.updateUserDataByQuery(
      { first_name, second_name },
      { user_id: ctx.userId }
    )
  );
  await ctx.reply("Данные успешно обновлены", { reply_markup: mainMenu });
}
