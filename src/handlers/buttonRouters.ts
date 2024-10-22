import { Composer } from "grammy";
import { MyContext } from "../types/grammy.types";
import { infoUnits, sendInfoMessage } from "../controllers/infoUnit";
import { paymentManage } from "../controllers/subscriptionUnit";
import sendStartMessage from "../serviceMessages/sendStartMessage";
import paymentApproved from "../serviceMessages/paymentApproved";
import { sendScheduleMessage } from "../controllers/scheduleUnit";
import { cancelMeetingRegApproveKeyboard } from "../keyboards/meetingsKeyboards";
import { mainMenu } from "../keyboards/generalKeyboards";
import meetingsDetailsController from "../dbSetup/handlers/meetingsDetailsController";
import sendAdminMenu from "../serviceMessages/adminSection/sendAdminMenu";
import logger from "#root/logger.ts";
import paymentCanceled from "#root/serviceMessages/paymentCanceled.ts";

export const keyboard = new Composer<MyContext>();
//TODO: add string checks
keyboard.callbackQuery(/gen__/, async (ctx) => {
  const path = ctx.callbackQuery.data.split("gen__")[1];

  switch (path) {
    case "info":
      await sendInfoMessage(ctx);
      break;
    case "meeting__reg":
      await ctx.conversation.enter("registrationForMeeting");
      break;
    case "meeting__reg_newbie":
      await ctx.conversation.enter("newbieSubConv");
      break;
    case "create_sub":
      await ctx.conversation.enter("subConv");
      break;
    case "schedule":
      await sendScheduleMessage(ctx);
      break;
    case "admin":
      await sendAdminMenu(ctx);
    default:
      logger.error("used sendStartMessage as default case at gen__");
      await sendStartMessage(ctx);
      break;
  }
});

keyboard.callbackQuery(/info_/, async (ctx) => {
  const path: string = ctx.callbackQuery.data.split("info_")[1];

  switch (path) {
    case "who":
      infoUnits(ctx).who();
      break;
    case "where":
      infoUnits(ctx).where();
      break;
    case "when":
      infoUnits(ctx).when();
      break;
    default:
      logger.error("used sendStartMessage as default case at info_");
      await sendStartMessage(ctx);
      break;
  }
});

keyboard.callbackQuery(/\bsub_/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const actionMatch = cbData.match(/_(\w+)_?/);
  let action = actionMatch ? actionMatch[1] : null;

  const userIdMatch = cbData.match(/_(\d+)$/);
  const userId = userIdMatch ? +userIdMatch[1] : null;

  if (userId) {
    console.log(1);

    // TODO: Добавить проверку
    const adminAction = action?.split("_")[0];

    switch (adminAction) {
      case "decline":
        await paymentManage(ctx, userId, "unactive");
        break;
      case "accept":
        await paymentManage(ctx, userId, "active");
        break;
      default:
        logger.error("used sendStartMessage as default case at sub_");
        await sendStartMessage(ctx);
        break;
    }
  } else {
    console.log(12);

    switch (action) {
      case "paid":
        await paymentApproved(ctx);
        break;
      case "cancel":
        await paymentCanceled(ctx);
        break;
      case "manage":
        await ctx.conversation.enter("paymentsManaging");
        break;
      default:
        logger.error("used sendStartMessage as default case at sub_");
        await sendStartMessage(ctx);
        break;
    }
  }
});

keyboard.callbackQuery(/meeting__/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const [action, meetingId, userId] = cbData.split(/meeting__/)[1].split("_");

  let messText = "";
  switch (action) {
    case "manage":
      messText = "Вы действительно хотите отменить запись на занятие?";
      await ctx.editMessageText(messText, {
        reply_markup: cancelMeetingRegApproveKeyboard(+meetingId, +userId),
      });
      break;
    case "cancel":
      await meetingsDetailsController.destroyUserReg(+meetingId, +userId);
      messText = "Регистрация на встречу отменена";
      await ctx.editMessageText(messText, {
        reply_markup: mainMenu,
      });
      break;
    default:
      logger.error("used sendStartMessage as default case at meeting__");
      await sendStartMessage(ctx);
      break;
  }
});

keyboard.callbackQuery("main_menu", async (ctx) => {
  await sendStartMessage(ctx);
});
