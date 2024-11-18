import { Composer } from "grammy";
import { cancelMeetingRegApproveKeyboard, mainMenu } from "#keyboards/index.js";
import { meetingsDetailsController } from "#db/handlers/index.js";
import logger from "#root/logger.js";
import {
  paymentManage,
  sendInfoMessage,
  sendScheduleMessage,
  sendAdminScheduleMessage,
  sendManageMessage,
  openDictionary,
  sendProfileMessage,
  meetingControlMenu,
} from "#controllers/index.js";
import type { infoUnitPathsType } from "#types/shared.types.js";
import logErrorAndThrow from "./logErrorAndThrow.js";
import { deleteMeetingAndRegs, endMeeting } from "#helpers/index.js";
import startHandler from "#serviceMessages/startHandler.js";
import sendAdminMenu from "#serviceMessages/sendAdminMenu.js";
import paymentManagement from "#serviceMessages/paymentManagement.js";
import type { MyContext } from "#types/grammy.types.js";
import { infoUnits } from "#controllers/infoUnit.js";

export const keyboard = new Composer<MyContext>();
//TODO: add string checks
keyboard.callbackQuery(/gen__/, async (ctx) => {
  type actionMap =
    | "info"
    | "meeting__reg"
    | "meeting__reg_newbie"
    | "create_sub"
    | "schedule"
    | "admin"
    | "profile";

  const actionsMap: Record<actionMap, (ctx: MyContext) => Promise<void>> = {
    info: sendInfoMessage,
    meeting__reg: (ctx: MyContext) =>
      ctx.conversation.enter("registrationForMeeting"),
    meeting__reg_newbie: (ctx: MyContext) =>
      ctx.conversation.enter("newbieSubConv"),
    create_sub: (ctx: MyContext) => ctx.conversation.enter("subConv"),
    schedule: sendScheduleMessage,
    admin: sendAdminMenu,
    profile: sendProfileMessage,
  };

  const path: actionMap = ctx.callbackQuery.data.split("gen__")[1] as actionMap;
  const action = actionsMap[path];
  if (path) {
    try {
      await action(ctx);
    } catch (error) {
      logErrorAndThrow(error, "error", "error handling gen__ path");
      await startHandler(ctx);
    }
  } else {
    logErrorAndThrow(
      new Error('No path inside "gen__ catcher"'),
      "debug",
      "path error"
    );
    await startHandler(ctx);
  }
});

keyboard.callbackQuery(/info_/, async (ctx) => {
  const path = ctx.callbackQuery.data.split("info_")[1] as infoUnitPathsType;

  try {
    await infoUnits(ctx, path);
  } catch (err) {
    await startHandler(ctx);
    logErrorAndThrow(err, "error", "Unable to use infoUn.js module");
  }
});

keyboard.callbackQuery(/\bsub_/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  const actionMatch = cbData.match(/_(\w+)_?/);
  const action = actionMatch ? actionMatch[1] : null;

  const userIdMatch = cbData.match(/_(\d+)$/);
  const userId = userIdMatch ? +userIdMatch[1] : null;

  if (userId) {
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
        await paymentManagement(ctx, "paid");
        break;
      case "cancel":
        await paymentManagement(ctx, "unactive");
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
  type callbackData = [actionMap, string, string];
  type actionMap =
    | "confirm-visit"
    | "create"
    | "manage"
    | "cancel"
    | "schedule"
    | "open-dictionary"
    | "end"
    | "control"
    | "admin-cancel"
    | "cancel-confirm"
    | "admin-cancel-confirm"
    | "feedback";

  const actionsMap: Record<
    actionMap,
    (ctx: MyContext) => Promise<void> | Promise<number | undefined>
  > = {
    "confirm-visit": startHandler,
    create: (ctx: MyContext) => ctx.conversation.enter("createMeetingConv"),
    manage: (ctx: MyContext) => sendManageMessage(ctx, +userId, +meetingId),
    cancel: async (ctx: MyContext) => {
      const messText = "Вы действительно хотите отменить запись на встречу?";
      await ctx.editMessageText(messText, {
        reply_markup: cancelMeetingRegApproveKeyboard(+meetingId, +userId),
      });
    },
    schedule: sendAdminScheduleMessage,
    "open-dictionary": (ctx: MyContext) => openDictionary(ctx, +meetingId),
    end: (ctx: MyContext) => endMeeting(ctx, +meetingId),
    control: (ctx: MyContext) => meetingControlMenu(ctx, +meetingId),
    "admin-cancel": async (ctx: MyContext) => {
      let messText = "Вы действительно хотите отменить запись на встречу?";
      messText += " В случае удаления все пользователи";
      messText += " будут уведомлены об этом";

      await ctx.editMessageText(messText, {
        reply_markup: cancelMeetingRegApproveKeyboard(+meetingId),
      });
    },
    "cancel-confirm": async (ctx: MyContext) => {
      await meetingsDetailsController.destroyUserReg(+meetingId, +userId);
      const messText = "Регистрация на встречу отменена";
      await ctx.editMessageText(messText, {
        reply_markup: mainMenu,
      });
    },
    "admin-cancel-confirm": (ctx: MyContext) =>
      deleteMeetingAndRegs(ctx, +meetingId),
    feedback: (ctx: MyContext) => {
      ctx.session.temp.feedbackMeetingId = +meetingId;
      return ctx.conversation.enter("meetingFeedback");
    },
  };

  const cbData = ctx.callbackQuery.data;
  const [path, meetingId, userId] = cbData
    .split(/meeting__/)[1]
    .split("_") as callbackData;

  const action = actionsMap[path];
  if (path) {
    try {
      await action(ctx);
    } catch (error) {
      logErrorAndThrow(error, "error", "error handling meeting__ path");
      await startHandler(ctx);
    }
  } else {
    logErrorAndThrow(
      new Error('No path inside "meeting__ catcher"'),
      "debug",
      "path error"
    );
    await startHandler(ctx);
  }
});

keyboard.callbackQuery(/profile__/, async (ctx) => {
  const cbData = ctx.callbackQuery.data;
  console.log(cbData);
  const [action, userId] = cbData.split(/profile__/)[1].split("_");

  switch (action) {
    case "change-name":
      await ctx.conversation.enter("changeName");
      break;
    case "archive":
      ctx.answerCallbackQuery();
      break;
    default:
      await startHandler(ctx);
      break;
  }
});

keyboard.callbackQuery("main_menu", async (ctx) => {
  await startHandler(ctx);
});
