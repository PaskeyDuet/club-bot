import { Composer } from "grammy";
import { MyContext } from "../types/grammy.types";
import { paymentManage } from "#controllers/index.ts";
import paymentApproved from "../serviceMessages/paymentApproved";
import { sendScheduleMessage } from "#controllers/index.ts";
import { cancelMeetingRegApproveKeyboard } from "../keyboards/meetingsKeyboards";
import { mainMenu } from "../keyboards/generalKeyboards";
import { meetingsDetailsController } from "#db/handlers/index.ts";
import sendAdminMenu from "../serviceMessages/sendAdminMenu";
import logger from "#root/logger.ts";
import paymentCanceled from "#root/serviceMessages/paymentCanceled.ts";
import { infoUnits, sendInfoMessage } from "#controllers/index.ts";
import { infoUnitPathsType } from "#types/shared.types.ts";
import logErrorAndThrow from "./logErrorAndThrow";
import { sendAdminScheduleMessage } from "#controllers/scheduleUnit.ts";
import {
  deleteMeetingAndRegs,
  meetingControlMenu,
} from "#helpers/meetingsHelpers.ts";
import startHandler from "#serviceMessages/startHandler.ts";

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
      break;
    default:
      logger.error("used startHandler as default case at gen__");
      await startHandler(ctx);
      break;
  }
});

keyboard.callbackQuery(/info_/, async (ctx) => {
  const path = ctx.callbackQuery.data.split("info_")[1] as infoUnitPathsType;

  try {
    await infoUnits(ctx, path);
  } catch (err) {
    await startHandler(ctx);
    logErrorAndThrow(err, "error", "Unable to use infoUnits module");
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
        logger.error("used startHandler as default case at sub_");
        await startHandler(ctx);
        break;
    }
  } else {
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
        logger.error("used startHandler as default case at sub_");
        await startHandler(ctx);
        break;
    }
  }
});

keyboard.callbackQuery(/meeting__/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const [action, meetingId, userId] = cbData.split(/meeting__/)[1].split("_");

  let messText = "";
  switch (action) {
    case "create":
      await ctx.conversation.enter("createMeetingConv");
      break;
    case "cancel":
      messText = "Вы действительно хотите отменить запись на встречу?";
      await ctx.editMessageText(messText, {
        reply_markup: cancelMeetingRegApproveKeyboard(+meetingId, +userId),
      });
      break;
    case "schedule":
      await sendAdminScheduleMessage(ctx);
      break;
    case "control":
      await meetingControlMenu(ctx, +meetingId);
      break;
    case "admin-cancel":
      messText = "Вы действительно хотите отменить запись на встречу?";
      messText += " В случае удаления все пользователи";
      messText += " будут уведомлены об этом";

      await ctx.editMessageText(messText, {
        reply_markup: cancelMeetingRegApproveKeyboard(+meetingId),
      });
      break;
    case "cancel-confirm":
      await meetingsDetailsController.destroyUserReg(+meetingId, +userId);
      messText = "Регистрация на встречу отменена";
      await ctx.editMessageText(messText, {
        reply_markup: mainMenu,
      });
      break;
    case "admin-cancel-confirm":
      await deleteMeetingAndRegs(ctx, +meetingId);
      break;
    default:
      logger.error("used startHandler as default case at meeting__");
      await startHandler(ctx);
      break;
  }
});

keyboard.callbackQuery("main_menu", async (ctx) => {
  await startHandler(ctx);
});
