import meetingsController from "#db/handlers/meetingsController.js";
import meetingsDetailsController from "#db/handlers/meetingsDetailsController.js";
import type Meetings from "#db/models/Meetings.js";
import dates from "#helpers/dates.js";
import guardExp from "#helpers/guardExp.js";
import { dbObjsToReadable, notificator } from "#helpers/index.js";
import { createMeetingsList } from "#helpers/meetingsHelpers.js";
import { meetingVisitNotificationKeyboard } from "#keyboards/index.js";

export default async function () {
  const h = notificatorHelpers;
  const tomorrowMeetings = await h.getTomorrowMeetings();
  const notificationPromises = tomorrowMeetings.map(
    h.sendNotificationForMeeting
  );
  await Promise.all(notificationPromises);
}

class NotificatorHelpers {
  /**
   * Получает список встреч, запланированных на завтра
   * @returns {Promise<Meeting[]>} Список встреч на завтра
   */
  async getTomorrowMeetings(): Promise<Meetings[]> {
    const futureMeetings = await meetingsController.futureMeetings();
    guardExp(futureMeetings, "currMeetings inside meetingNotificator");
    return futureMeetings.filter((el) => dates.dateIsTomorrow(String(el.date)));
  }

  /**
   * Получает список ID пользователей для заданной встречи
   * @param {Meeting} meeting - Встреча для которой нужно получить ID пользователей
   * @returns {Promise<string[]>} Список ID пользователей
   */
  async getTomorrowUserIds(meeting: Meetings): Promise<number[]> {
    const userObjsArr = await meetingsDetailsController.findAllByQuery({
      meeting_id: meeting.meeting_id,
    });
    return userObjsArr.map((user) => user.user_id);
  }

  /**
   * Подготавливает строку с информацией о встрече в читаемом формате
   * @param {Meeting} meeting - Встреча для отображения информации
   * @returns {string} Строка с информацией о встрече
   */
  prepareMeetingInfoStr(meeting: Meetings): string {
    const dbReadableObj = dbObjsToReadable([meeting])[0];
    dbReadableObj.date = `Завтра, ${dbReadableObj.date}`;
    return createMeetingsList.userView([dbReadableObj]);
  }

  /**
   * Подготавливает текст уведомления для заданной встречи
   * @param {Meeting} meeting - Встреча для подготовки текста уведомления
   * @returns {string} Текст уведомления
   */
  prepareNotificationText(meeting: Meetings): string {
    let text = "Вы записаны на следующую встречу:\n";
    text += this.prepareMeetingInfoStr(meeting);
    return text;
  }

  /**
   * Рассылка среди зарегистрированных пользователей о предстоящей встрече
   * @param {Meeting} meeting - Встреча для подготовки текста уведомления и получения ids пользователей
   * @returns {Promise<void[]>}
   */
  sendNotificationForMeeting = async (
    meeting: Meetings
  ): Promise<Promise<void>[]> => {
    const userIds = await this.getTomorrowUserIds(meeting);
    const textToSend = this.prepareNotificationText(meeting);
    return userIds.map((id) =>
      this.sendMessageById(meeting.meeting_id, id, textToSend)
    );
  };

  /**
   * Отправка сообщения конкретному пользователю
   * @param {number} meetingId - ID встречи
   * @param {number} userId - ID пользователя
   * @param {string} text - Текст сообщения
   * @returns {Promise<void>}
   */
  async sendMessageById(
    meetingId: number,
    userId: number,
    text: string
  ): Promise<void> {
    const k = meetingVisitNotificationKeyboard(meetingId, userId);
    return notificator.sendMessageById(text, userId, k);
  }
}

// Создание экземпляра класса
const notificatorHelpers = new NotificatorHelpers();
