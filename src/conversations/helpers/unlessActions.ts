import { MyContext } from "../../types/grammy.types";

export default async function (ctx: MyContext, otherwise: any) {
  if (
    ctx?.callbackQuery?.data === "back" ||
    ctx?.callbackQuery?.data === "main_menu"
  ) {
    return;
  }
  if (
    ["/start", "/orders", "/cart", "/help"].includes(ctx?.message?.text ?? "")
  ) {
    return;
  }

  return await otherwise();
}
