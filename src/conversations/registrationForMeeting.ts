import { keyboard } from "#root/handlers/buttonRouters.ts";
import logErrorAndThrow from "#root/handlers/logErrorAndThrow.ts";
import meetingsController from "../dbSetup/handlers/meetingsController";
import meetingsDetailsController from "../dbSetup/handlers/meetingsDetailsController";
import createFutureMeetingsList from "../helpers/createFutureMeetingsList";
import getFutureMeetings from "../helpers/getFutureMeetings";
import { mainMenu } from "../keyboards/generalKeyboards";
import {
  generateMeetingsKeyboard,
  meetingRegApprovedKeyboard,
} from "../keyboards/meetingsKeyboards";
import { MyContext, MyConversation } from "../types/grammy.types";
import {
  MeetingsObject,
  TextWithInlineKeyboardObj,
} from "../types/shared.types";
import chooseMeetingNumber from "./helpers/regForMeeting/chooseMeetingNumber";
import userFilteredMeetings from "./helpers/regForMeeting/userFilteredMeetings";

//TODO: В дальнейшем необходимо добавить условие "Человек - новичок"
export async function registrationForMeeting(
  conversation: MyConversation,
  ctx: MyContext
) {
  try {
    const futureMeetingsWithUsers =
      await meetingsController.futureMeetingsWithUsers();
    const futureMeetings = await getFutureMeetings();
    [];

    if (!futureMeetings || !futureMeetingsWithUsers) {
      throw new Error("futureMeetings or futureMeetingsWithUsers is undefined");
    }

    const availableRegs = userFilteredMeetings(
      futureMeetings,
      futureMeetingsWithUsers
    );

    const baseMess = baseMessObj(availableRegs);
    await ctx.editMessageText(baseMess.text, {
      reply_markup: baseMess.keyboard,
    });

    await chooseMeetingNumber(conversation, ctx, baseMess);
    const meetingId = conversation.session.temp.meetingNumber;

    if (meetingId) {
      await meetingsDetailsController.addUserToMeet(ctx.userId, meetingId);

      const currMeeting = futureMeetings.find(
        (el) => el.meetingId === meetingId
      );
      if (!currMeeting) {
        throw new Error(
          "can't find currMeeting by meetingId inside regForMeeting"
        );
      }
      const isNewbie = ctx.session.user.isNewbie;
      const finalMessage = finalMessObj(currMeeting, isNewbie);
      await ctx.editMessageText(finalMessage.text, {
        reply_markup: finalMessage.keyboard,
        parse_mode: "HTML",
      });
    }
  } catch (err) {
    logErrorAndThrow(err, "fatal", "Can't registrate a user for a meeting");
  }
}

const baseMessObj = (
  availableRegs: MeetingsObject[]
): TextWithInlineKeyboardObj => {
  let text = "";
  let keyboard;
  if (availableRegs.length !== 0) {
    text += "На данный момент для записи ";
    text += "доступны следующие встречи:\n\n";
    text += createFutureMeetingsList(availableRegs);
    text += "\nВыберите ту, на которую ";
    text += "вы хотели бы записаться, нажав на кнопку ниже👇🏻";
    keyboard = generateMeetingsKeyboard(availableRegs);
  } else {
    text = "На данный момент нет доступных встреч. Зайдите позже";
    keyboard = mainMenu;
  }

  return {
    text,
    keyboard,
  };
};

const finalMessObj = (
  currMeeting: MeetingsObject,
  isNewbie: boolean
): TextWithInlineKeyboardObj => {
  let text = "";
  text += `Вы успешно зарегистрировались на занятие по теме <b>${currMeeting.topic}</b> `;
  text += `которое пройдет <b>${currMeeting.date}</b> в <b>${currMeeting.place}</b>\n\n`;
  text += `Вы можете проверить список ваших текущих записей в главном меню\n`;
  text += `Мы оповестим вас о посещении за день до встречи`;
  let keyboard = meetingRegApprovedKeyboard(isNewbie);
  return { text, keyboard };
};
