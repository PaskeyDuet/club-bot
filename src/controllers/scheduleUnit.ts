import {
  createMeetingsList,
  readableObjsWithCount,
  guardExp,
  smoothReplier,
} from "#helpers/index.js";
import { meetingsController } from "#db/handlers/index.js";
import { generateMeetingsKeyboard } from "#keyboards/index.js";
import type {
  MeetingObjectWithUserCountType,
  MeetingsWithDetailsObject,
} from "#types/shared.types.js";
import type { MyContext } from "#types/grammy.types.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import type Meetings from "#db/models/Meetings.js";
import { userManageMeeting } from "#keyboards/index.js";
import { getMeetingById } from "#helpers/meetingsHelpers.js";

async function sendScheduleMessage(ctx: MyContext) {
  const userMeetings = await meetingsController.futureMeetingsWithUsers(
    ctx.userId
  );
  guardExp(userMeetings, "userMeetings inside scheduleUnit");

  const texts = usertexts;
  let meetingsInfo: string;
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

async function sendManageMessage(
  ctx: MyContext,
  userId: number,
  meetingId: number
) {
  const meeting = await getMeetingById(meetingId);
  const meetingText = createMeetingsList.userView([meeting]);
  const k = userManageMeeting(meetingId, userId);
  await ctx.editMessageText(meetingText, {
    reply_markup: k,
  });
}
async function sendAdminScheduleMessage(ctx: MyContext) {
  const allMeetings = await meetingsController.futureMeetingsWithUsers();
  guardExp(allMeetings, "allDbMeetings inside sendAdminScheduleMessage");
  const allMeetingsWithUserCount = await readableObjsWithCount(allMeetings);

  const texts = admintexts;

  let meetingsInfo: string;
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

const admintexts = {
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

const usertexts = {
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
  meetingManaging: (meeting: Meetings) => {},
};

export { sendScheduleMessage, sendAdminScheduleMessage, sendManageMessage };
