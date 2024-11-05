import logErrorAndThrow from "#handlers/logErrorAndThrow.ts";
import {
  meetingsController,
  meetingsDetailsController,
} from "#db/handlers/index.ts";
import {
  MeetingObject,
  MeetingObjectWithId,
  MeetingObjectWithUserCountType,
} from "#types/shared.types";
import { dates, guardExp, smoothReplier, notificator } from "./index.ts";
import Meetings, {
  MeetingsCreationType,
  MeetingsType,
} from "#db/models/Meetings.ts";
import { adminMenu, manageMeeting } from "#keyboards/index.ts";

async function meetingControlMenu(ctx: MyContext, meetingId: number) {
  let messText = "Информация о встрече:\n\n";
  messText += await meetingInfoGetter(meetingId);
  messText += "\n\nВыберите действие";

  await ctx.editMessageText(messText, {
    reply_markup: manageMeeting(+meetingId),
  });
}

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
  userView(meetings: MeetingObject[] | MeetingsType[]) {
    return meetings
      .map((el) => `📅 ${el.date}\n🗒 ${el.topic}\n📍 ${el.place}\n`)
      .join("\n");
  },
  adminView(meetings: MeetingObjectWithUserCountType[]) {
    return meetings
      .map(
        (el) =>
          `📅 ${el.date}\n🗒 ${el.topic}\n📍 ${el.place}\n ${el.userCount}/8\n`
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

async function deleteMeetingAndRegs(ctx: MyContext, meetingId: number) {
  try {
    const h = deleteMeetingAndRegsHelpers;

    const userIds = await findRegUserIds(meetingId);
    const meetingInfo = await meetingInfoGetter(meetingId, userIds);
    const meetingUsersDelRes = await h.deleteUserRegs(userIds);
    const meetingDelRes = await h.deleteMeeting(meetingId);
    await h.cancelationNotif(userIds, meetingInfo);
    //add users check
    const dbActionsRes = meetingDelRes === 1;
    await h.finalMessage(ctx, dbActionsRes);
  } catch (err) {
    await ctx.reply("Заполни меня");
  }
}

async function findRegUserIds(meetingId: number) {
  const userRegs = await meetingsDetailsController.findAllByQuery({
    meeting_id: meetingId,
  });
  return userRegs.map((el) => +el.user_id);
}

const deleteMeetingAndRegsHelpers = {
  async deleteMeeting(meetingId: number) {
    return await meetingsController.deleteMeeting(meetingId);
  },

  async deleteUserRegs(userIds: number[]) {
    return await meetingsDetailsController.destroyUserRegs(userIds);
  },

  async finalMessage(ctx: MyContext, dbActionsRes: boolean) {
    let text;
    console.log(dbActionsRes);

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

export {
  meetingControlMenu,
  getFutureMeetings,
  prepareDbMeetingObj,
  dbObjDateTransform,
  dbObjsToReadable,
  createMeetingsList,
  deleteMeetingAndRegs,
  readableObjsWithCount,
};
