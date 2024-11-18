import meetingsController from "#db/handlers/meetingsController.js";
import notificator from "#helpers/notificator.js";
import { mainMenu } from "#keyboards/generalKeyboards.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import { InlineKeyboard } from "grammy";

type strWithKeyboard = Map<string, InlineKeyboard | undefined>;

export default async function meetingFeedback(
  conversation: MyConversation,
  ctx: MyContext
) {
  const h = meetingFeedbackH(conversation, ctx);

  const qsWithKsMap = h.getQuestionsWithK();
  const answersMap = (await h.processAnswers(qsWithKsMap)) as Map<
    string,
    string
  >;
  const answersText = await h.answersCompose(answersMap);
  await h.sendToGroup(answersText);
  await h.endFeedback();
  h.clearTemp();
}

const meetingFeedbackH = (conversation: MyConversation, ctx: MyContext) => ({
  getMeetingId: () => {
    const meetingId = ctx.session.temp.feedbackMeetingId;
    if (!meetingId) {
      throw new Error("No meetingId");
    }
    return meetingId;
  },
  getQuestionsWithK(): strWithKeyboard {
    //TODO: Make it read questions from info files
    return new Map(
      Object.entries({
        "Question 1": feedbackK.yesNoK(),
        "Question 2": feedbackK.yesNoK(),
        "Question 3": feedbackK.yesNoK(),
        "Question 4": feedbackK.noK,
      })
    );
  },
  processAnswers: async (qsWithKsMap: strWithKeyboard) => {
    const answers = new Map();
    for await (const qWithK of qsWithKsMap) {
      const [q, k] = qWithK;

      await ctx.reply(q, { reply_markup: k, parse_mode: "HTML" });
      const message = await conversation.wait();

      const answer =
        message.callbackQuery?.data || message.message?.text || "Пропустить";
      if (!message.callbackQuery && !message.message?.text) {
        await ctx.reply("Ответ не был записан.\nИспользуйте кнопки или текст");
      }
      if (message.callbackQuery) {
        await message.answerCallbackQuery();
      }
      answers.set(q, answer);
    }
    return answers;
  },
  async answersCompose(answers: Map<string, string>) {
    const topic = await this.getMeetingTopic();
    const user = ctx.session.user;
    let text = `Отзыв по занятию по теме ${topic}`;
    text += `${user.firstName} ${user.secondName}\n`;
    text += `@${ctx.from?.username || "username скрыт"}\n\n`;

    for (const qWithAnswer of answers) {
      text += `${qWithAnswer.join(": ")}\n`;
    }
    return text;
  },
  async getMeetingTopic() {
    const meetingId = this.getMeetingId();
    const meeting = await meetingsController.findMeeting(meetingId);
    return meeting?.topic;
  },
  sendToGroup: (text: string) => notificator.newFeedback(text),
  endFeedback: () =>
    ctx.reply("Спасибо за уделенное время", { reply_markup: mainMenu }),
  clearTemp: () => {
    conversation.session.temp.feedbackMeetingId = null;
  },
});

const feedbackK = {
  yesNoK: () =>
    new InlineKeyboard().text("Нет").text("Да").row().text("Пропустить"),
  fromBadToVeryGoodK: () =>
    new InlineKeyboard()
      .text("Плохо", "Плохо")
      .text("Хорошо", "Хорошо")
      .row()
      .text("Пропустить"),
  noK: undefined,
};
