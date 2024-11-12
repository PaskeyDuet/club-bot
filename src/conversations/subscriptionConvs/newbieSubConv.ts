import { guardExp } from "#helpers/index.js";
import { meetingsController } from "#db/handlers/index.js";
import { mainMenu, subKeyboard } from "#keyboards/index.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
//TODO: move texts down to helper functions
export async function newbieSubConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  const isNewbie = ctx.session.user.isNewbie;
  const userFutureMeetings = await meetingsController.futureMeetingsWithUsers(
    ctx.userId
  );
  guardExp(userFutureMeetings, "userFutureMeetings inside newbieSubConv");

  if (isNewbie && userFutureMeetings.length) {
    let regDenyText = "Для пробного посещения доступно только одно посещение\n";
    regDenyText +=
      "В главном меню вы можете отменить запись и затем зарегистрироваться на другую встречу";
    await ctx.editMessageText(regDenyText, { reply_markup: mainMenu });
    return;
  }

  let generalInfo = "";
  generalInfo +=
    "Так как мы только познакомились, предлагаем тебе бесплатно посетить нашу встречу\n";
  generalInfo +=
    'Для этого нажми кнопку "Записаться" ниже и выбери подходящую дату';

  try {
    ctx.editMessageText(generalInfo, {
      reply_markup: subKeyboard(isNewbie),
      parse_mode: "HTML",
    });
  } catch (error) {
    console.log("newbieSubConv error");
  }
}
