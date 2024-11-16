import {
  createMeetingsList,
  readableObjsWithCount,
  guardExp,
  smoothReplier,
  createVocabularyList,
  meetingInfoGetter,
} from "#helpers/index.js";
import {
  meetingsController,
  vocabularyTagController,
} from "#db/handlers/index.js";
import { backButton, generateMeetingsKeyboard } from "#keyboards/index.js";
import type {
  MeetingObjectWithUserCountType,
  MeetingsWithDetailsObject,
} from "#types/shared.types.js";
import type { MyContext } from "#types/grammy.types.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import type Meetings from "#db/models/Meetings.js";
import { userManageMeeting } from "#keyboards/index.js";
import { getMeetingById } from "#helpers/meetingsHelpers.js";
import meetingsVocabularyController from "#db/handlers/meetingsVocabularyController.js";
import type { RawVocabularyWithTagNameT } from "#db/models/MeetingsVocabulary.js";
import { adminManageMeeting } from "#keyboards/meetingsKeyboards.js";

async function sendScheduleMessage(ctx: MyContext) {
  const userMeetings = await meetingsController.futureMeetingsWithUsers(
    ctx.userId
  );
  guardExp(userMeetings, "userMeetings inside scheduleUnit");
  console.log("schedule");

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

async function openDictionary(ctx: MyContext, meeting_id: number) {
  const dbStructuredVocab = await meetingsVocabularyController.findAllByQuery({
    meeting_id,
  });
  const vocabArr: RawVocabularyWithTagNameT[] = dbStructuredVocab.map(
    (unit) => ({
      lexical_unit: unit.lexical_unit,
      translation: unit.translation,
      example: unit.example,
      example_translation: unit.example_translation,
      tag_name: "*",
    })
  );
  const text = createVocabularyList.withoutTags(vocabArr);
  await ctx.editMessageText(text, {
    reply_markup: backButton,
    parse_mode: "HTML",
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

async function meetingControlMenu(ctx: MyContext, meetingId: number) {
  let messText = "Информация о встрече:\n\n";
  messText += await meetingInfoGetter(meetingId);
  messText += "\n\nВыберите действие";

  await ctx.editMessageText(messText, {
    reply_markup: adminManageMeeting(+meetingId),
  });
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

export {
  meetingControlMenu,
  sendScheduleMessage,
  sendAdminScheduleMessage,
  sendManageMessage,
  openDictionary,
};
