import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import {
  meetingsController,
  meetingsDetailsController,
} from "#db/handlers/index.js";
import type {
  MeetingObject,
  MeetingObjectWithId,
  MeetingObjectWithUserCountType,
} from "#types/shared.types.js";
import { dates, guardExp, smoothReplier, notificator } from "./index.js";
import Meetings, {
  type MeetingsCreationType,
  type MeetingsType,
} from "#db/models/Meetings.js";
import { adminManageMeeting, adminMenu } from "#keyboards/index.js";
import type { MyContext } from "#types/grammy.types.js";
import type { RawVocabularyWithTagNameT } from "#db/models/MeetingsVocabulary.js";
import meetingsVocabularyController from "#db/handlers/meetingsVocabularyController.js";
import { InlineKeyboard } from "grammy";
import { Transaction } from "sequelize";

async function getFutureMeetings(): Promise<MeetingObjectWithId[] | undefined> {
  try {
    const allMeetings = await meetingsController.futureMeetings();
    guardExp(allMeetings, "allMeetings inside futureMeetingsHelpers");

    return allMeetings.map((meeting) => {
      const dv = meeting.dataValues;
      const dateDetails: string = dates.meetingDateParser(dv.date);
      return {
        meetingId: dv.meeting_id,
        place: dv.place,
        topic: dv.topic,
        date: dateDetails,
      };
    });
  } catch (error) {
    logErrorAndThrow(error, "fatal", "Error fetching future meetings");
  }
}
async function getMeetingById(meetingId: number) {
  const meeting = await meetingsController.findMeeting(meetingId);
  guardExp(meeting, "meeting inside meetingInfoGetter");
  return dbObjDateTransform(meeting);
}
const prepareDbMeetingObj = (
  meetingObj: MeetingObject
): MeetingsCreationType => ({
  place: meetingObj.place,
  topic: meetingObj.topic,
  date: dates.meetingDateFromString(meetingObj.date),
});

const dbObjDateTransform = (meeting: Meetings): MeetingObjectWithId => ({
  meetingId: meeting.meeting_id,
  date: dates.meetingDateParser(meeting.date),
  place: meeting.place,
  topic: meeting.topic,
});

const dbObjsToReadable = (meetings: Meetings[]): MeetingObjectWithId[] =>
  meetings.map((el) => dbObjDateTransform(el));

const createMeetingsList = {
  userView(
    meetings:
      | MeetingObject[]
      | MeetingsType[]
      | MeetingObjectWithId[]
      | MeetingsCreationType[]
  ) {
    return meetings
      .map((el) => `📅 ${el.date}\n🗒 ${el.topic}\n📍 ${el.place}\n`)
      .join("\n");
  },
  adminView(meetings: MeetingObjectWithUserCountType[]) {
    return meetings
      .map(
        (el) =>
          `📅 ${el.date}\n🗒 ${el.topic}\n📍 ${el.place}\n 👥 ${el.userCount}/8\n`
      )
      .join("\n");
  },
  adminShortView(meetings: MeetingObjectWithUserCountType[]) {
    //TODO: change number 8 using env limits
    return meetings
      .map((el) => `${el.date} -- ${el.topic} -- ${el.userCount}/8\n`)
      .join("\n");
  },
};

const createVocabularyList = {
  basicView: (vocabList: RawVocabularyWithTagNameT[]) => {
    return vocabList
      .map((unit) => {
        let str = `<i>${unit.tag_name}</i>\n`;
        str += `<b>${unit.lexical_unit}</b> - ${unit.translation}\n`;
        str += `${unit.example}\n<i>${unit.example_translation}</i>\n`;
        return str;
      })
      .join("\n");
  },
  withoutTags: (vocabList: RawVocabularyWithTagNameT[]) => {
    return vocabList
      .map((unit) => {
        let str = `<b>${unit.lexical_unit}</b> - ${unit.translation}\n`;
        str += `${unit.example}\n<i>${unit.example_translation}</i>\n`;
        return str;
      })
      .join("\n");
  },
};

async function deleteMeetingAndRegs(ctx: MyContext, meetingId: number) {
  try {
    const h = deleteMeetingAndRegsHelpers;

    const userIds = await findRegUserIds(meetingId);
    const meetingInfo = await meetingInfoGetter(meetingId, userIds);
    const meetingUsersDelRes = await h.deleteUserRegs(userIds);
    const meetingDelRes = await h.deleteMeetingAndVocab(meetingId);
    await h.cancelationNotif(userIds, meetingInfo);
    //add users check
    const dbActionsRes = meetingDelRes === 1;
    await h.finalMessage(ctx, dbActionsRes);
  } catch (err) {
    await ctx.reply("Заполни меня");
  }
}

async function findRegUserIds(meetingId: number, transaction?: Transaction) {
  const userRegs = await meetingsDetailsController.findAllByQuery({
    meeting_id: meetingId,
  });
  return userRegs.map((el) => el.user_id);
}

const deleteMeetingAndRegsHelpers = {
  async deleteMeetingAndVocab(meeting_id: number) {
    const vocabdelRes = await meetingsVocabularyController.deleteVocabByQuery({
      meeting_id,
    });
    console.log(vocabdelRes);

    return await meetingsController.deleteMeeting(meeting_id);
  },

  async deleteUserRegs(userIds: number[]) {
    return await meetingsDetailsController.destroyUserRegs(userIds);
  },

  async finalMessage(ctx: MyContext, dbActionsRes: boolean) {
    let text: string;

    if (dbActionsRes) {
      text = "Данные о встрече и регистрациях ";
      text += "были успешно удалены. Рассылка создана";
    } else {
      text = "Произошла некоторая ошибка. Обратитесь к администратору бота";
    }
    await smoothReplier(ctx, text, adminMenu, "deleteMeetingAndRegs");
  },

  async cancelationNotif(ids: number[], meetingInfo: string) {
    let text = "Была отменена следующая встреча:\n\n";
    text += meetingInfo;

    return await notificator.sendBulkMessages(text, ids);
  },
};

async function meetingInfoGetter(meetingId: number, usersIds?: number[]) {
  const meeting = await Meetings.findOne({
    where: { meeting_id: meetingId },
  });
  guardExp(meeting, "meeting inside meetingInfoGetter");
  const meetingObj = dbObjDateTransform(meeting);

  if (!usersIds) {
    usersIds = await findRegUserIds(meetingId);
  }

  const meetingsWithUserCount: MeetingObjectWithUserCountType = {
    ...meetingObj,
    userCount: usersIds.length,
  };
  return createMeetingsList.adminView([meetingsWithUserCount]);
}

const readableObjsWithCount = async (meetings: MeetingObjectWithId[]) => {
  const meetingPromises = meetings.map(async (el) => {
    const users = await findRegUserIds(el.meetingId);
    const newObj: MeetingObjectWithUserCountType = {
      ...el,
      userCount: users.length,
    };
    return newObj;
  });
  return await Promise.all(meetingPromises);
};

const endMeeting = async (ctx: MyContext, meetingId: number) => {
  const h = endMeetingH(meetingId);

  try {
    const userIds = await findRegUserIds(meetingId);
    await h.updateMeetingStatus();
    const t = h.formText();
    const k = h.getKeyboard();
    await notificator.sendBulkMessages(t, userIds, k);
    await ctx.reply("Встреча завершена", { reply_markup: adminMenu });
  } catch (error) {
    logErrorAndThrow(error, "error", "error trying to endMeeting");
  }
};
const endMeetingH = (meeting_id: number) => ({
  updateMeetingStatus() {
    return meetingsController.updateByQuery({ ended: true }, { meeting_id });
  },
  async getMeetingName() {
    const meeting = await meetingsController.findMeeting(meeting_id);
    guardExp(meeting, "meeting inside getMeetingName");
    return meeting.topic;
  },
  formText() {
    const topic = this.getMeetingName();
    let text = `Спасибо, что посетил встречу по теме ${topic}]n`;
    text += "Ответь на несколько вопросов";
    return text;
  },
  getKeyboard() {
    return new InlineKeyboard().text(
      "Приступим",
      `meeting__feedback_${meeting_id}`
    );
  },
});

export {
  meetingInfoGetter,
  getFutureMeetings,
  prepareDbMeetingObj,
  dbObjDateTransform,
  dbObjsToReadable,
  createMeetingsList,
  createVocabularyList,
  deleteMeetingAndRegs,
  readableObjsWithCount,
  getMeetingById,
  endMeeting,
};
