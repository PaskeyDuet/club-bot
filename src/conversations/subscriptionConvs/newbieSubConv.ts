import meetingsController from "../../dbSetup/handlers/meetingsController";
import { mainMenu } from "../../keyboards/generalKeyboards";
import { subKeyboard } from "../../keyboards/subKeyboards";
import { MyContext, MyConversation } from "../../types/grammy.types";

export async function newbieSubConv(
  conversation: MyConversation,
  ctx: MyContext
) {
  const isNewbie = ctx.session.user.isNewbie;
  const futureMeetingsWithUsers =
    await meetingsController.futureMeetingsWithUsers();

  if (isNewbie && futureMeetingsWithUsers.length) {
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
    console.log("sendInfoMessage");
  }
}
