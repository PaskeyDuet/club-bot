import meetingsController from "../dbSetup/handlers/meetingsController";
import createFutureMeetingsList from "../helpers/createFutureMeetingsList";
import { generateMeetingsKeyboard } from "../keyboards/meetingsKeyboards";
import { MyContext } from "../types/grammy.types";

export async function sendScheduleMessage(ctx: MyContext) {
  const userMeetings = await meetingsController.futureMeetingsWithUsers(
    ctx.userId
  );

  let meetingsInfo = "";
  if (userMeetings.length) {
    meetingsInfo +=
      "На данный момент вы зарегистрированы на следующие встречи:\n\n";
    meetingsInfo += createFutureMeetingsList(userMeetings);
    meetingsInfo += "\nЕсли хотите отменить посещение ";
    meetingsInfo += "одной из встреч, выберите её ниже";
  } else {
    meetingsInfo += "На данный момент вы не ";
    meetingsInfo += "зарегистрированы ни на одну из встреч";
  }

  try {
    ctx.editMessageText(meetingsInfo, {
      reply_markup: generateMeetingsKeyboard(userMeetings),
    });
  } catch (error) {
    console.log("sendInfoMessage");
  }
}

export async function cancelMeetingReg(
  ctx: MyContext,
  meetingId: number,
  userId: number
) {
  const messText = "Вы действительно хотите отменить запись на занятие";
  await ctx.editMessageText(messText);
  console.log(ctx.callbackQuery);
}
