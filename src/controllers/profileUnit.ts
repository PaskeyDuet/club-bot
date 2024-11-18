import dates from "#helpers/dates.js";
import type { MyContext, TelegramUser } from "#types/grammy.types.js";
import { InlineKeyboard } from "grammy";

async function sendProfileMessage(ctx: MyContext) {
  const h = new ProfileMessageH(ctx);

  const text = h.createMessageText();
  const k = h.createKeyboard();
  await ctx.editMessageText(text, { reply_markup: k, parse_mode: "HTML" });
}
class ProfileMessageH {
  ctx: MyContext;
  user: TelegramUser;
  hasSub: boolean;
  firstName: string;
  secondName: string;
  subEndDate: string;
  subNumber: number;

  constructor(ctx: MyContext) {
    this.ctx = ctx;
    this.user = ctx.session.user;
    this.hasSub = this.user.hasSub;
    this.firstName = this.user.firstName;
    this.secondName = this.user.secondName;
    this.subEndDate = this.user.subEndDate;
    this.subNumber = this.user.subNumber;
  }
  createMessageText() {
    let text = `Ваше имя: ${this.firstName} ${this.secondName}\n`;
    text += "Cтатус подписки: ";
    if (this.subNumber === 0 || !this.hasSub) {
      text += "неактивна ❌\n";
    } else {
      text += "активна ✅\n";
      text += "Действительна до: ";
      this.setSplittedDate();
      text += `${this.subEndDate}\n`;
    }
    //TODO: добавить время до ближайшей встречи или дата ближайшей встречи
    return text;
  }
  setSplittedDate() {
    this.subEndDate = dates.getStrDateWithoutTime(this.subEndDate);
  }
  createKeyboard() {
    return (
      new InlineKeyboard()
        .text("Изменить имя", `profile__change-name_${this.ctx.userId}`)
        // .row()
        // .text("Архив встреч (скоро)", "profile__archive")
        .row()
        .text("Назад", "back")
    );
  }
}

export { sendProfileMessage };
