import { subscriptionController } from "#db/handlers/index.ts";
import { MyContext } from "../types/grammy.types";
import { admin } from "../bot";
import notificator from "#helpers/notificator.ts";

export async function paymentManage(
  ctx: MyContext,
  userId: number,
  status: "unactive" | "active"
) {
  // TODO: Возвращать объект со статусом запроса (частично или полностью выполнен запрос - база возавращает [0]/[1], sendRes - message или ошибку)
  const updateRes = await subscriptionController.updateSubStatus(
    userId,
    status
  );

  let messText = "";
  switch (status) {
    case "active":
      messText = "Ваша подписка активирована!";
      break;
    case "unactive":
      messText = "Ваш платёж отклонён. Свяжитесь с нашим менеджером @romanovnr";
      break;
  }
  await notificator.sendMessageById(messText, userId);
  // console.log("sendres", sendRes);
}
