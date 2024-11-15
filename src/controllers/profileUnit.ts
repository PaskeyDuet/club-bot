import dates from "#helpers/dates.js";
import type { MyContext, TelegramUser } from "#types/grammy.types.js";

async function sendProfileMessage(ctx: MyContext) {
  const h = new ProfileMessageH(ctx);

  const text = h.createMessageText();
  await ctx.editMessageText(text);
}
class ProfileMessageH {
  user: TelegramUser;
  hasSub: boolean;
  firstName: string;
  secondName: string;
  subEndDate: string;
  subNumber: number;

  constructor(ctx: MyContext) {
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
}

export { sendProfileMessage };
