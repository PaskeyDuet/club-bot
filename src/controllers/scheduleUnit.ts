import {
  createMeetingsList,
  dbObjsToReadable,
  readableObjsWithCount,
} from "#helpers/meetingsHelpers.ts";
import guardExp from "#root/helpers/guardExp.ts";
import { meetingsController } from "#db/handlers/index.ts";
import { generateMeetingsKeyboard } from "../keyboards/meetingsKeyboards";
import { MyContext } from "../types/grammy.types";
import {
  MeetingObjectWithUserCountType,
  MeetingsWithDetailsObject,
} from "#types/shared.types.ts";
import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import smoothReplier from "#helpers/smoothReplier.ts";

export async function sendScheduleMessage(ctx: MyContext) {
  const userMeetings = await meetingsController.futureMeetingsWithUsers(
    ctx.userId
  );
  guardExp(userMeetings, "userMeetings inside scheduleUnit");

  const texts = userTexts;
  let meetingsInfo;
  if (userMeetings.length) {
    meetingsInfo = texts.regs(userMeetings);
  } else {
    meetingsInfo = texts.noRegs();
  }

  try {
    await smoothReplier(
      ctx,
      meetingsInfo,
      generateMeetingsKeyboard(userMeetings, false),
      "sendScheduleMessage"
    );
  } catch (err) {
    logErrorAndThrow(
      err,
      "error",
      "Unable to edit text inside sendScheduleMessage"
    );
  }
}

export async function sendAdminScheduleMessage(ctx: MyContext) {
  const allDbMeetings = await meetingsController.futureMeetings();
  guardExp(allDbMeetings, "allDbMeetings inside sendAdminScheduleMessage");
  const allMeetings = dbObjsToReadable(allDbMeetings);
  const allMeetingsWithUserCount = await readableObjsWithCount(allMeetings);

  const texts = adminTexts;

  let meetingsInfo;
  if (allMeetings.length !== 0) {
    meetingsInfo = texts.currentMeetings(allMeetingsWithUserCount);
  } else {
    meetingsInfo = texts.noMeetings();
  }

  try {
    await smoothReplier(
      ctx,
      meetingsInfo,
      generateMeetingsKeyboard(allMeetings, true),
      "sendScheduleMessage"
    );
  } catch (err) {
    logErrorAndThrow(
      err,
      "error",
      "Unable to edit text inside sendScheduleMessage"
    );
  }
}

const adminTexts = {
  currentMeetings: (meetings: MeetingObjectWithUserCountType[]) => {
    let text = "На данный момент ";
    text += "зарегистрированы следующие встречи:\n\n";
    text += createMeetingsList.adminShortView(meetings);
    return text;
  },
  noMeetings: () => {
    return "Ещё не зарегистрировано ни одной встречи";
  },
};

const userTexts = {
  regs: (userMeetings: MeetingsWithDetailsObject[]) => {
    let text = "На данный момент вы ";
    text += "зарегистрированы на следующие встречи:\n\n";
    text += createMeetingsList.userView(userMeetings);
    text += "\nЕсли хотите отменить посещение ";
    text += "одной из встреч, выберите её ниже";
    return text;
  },
  noRegs: () => {
    let text = "На данный момент вы не ";
    text += "зарегистрированы ни на одну из встреч";
    return text;
  },
};
