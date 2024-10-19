import MeetingsDetails from "../models/MeetingsDetails";

export default {
  findAll: async () => await MeetingsDetails.findAll(),
  addUserToMeet: async (userId: number, meetingId: number) => {
    return await MeetingsDetails.create({
      user_id: userId,
      meeting_id: meetingId,
    });
  },
  destroyUserReg: async (meetingId: number, userId: number) =>
    await MeetingsDetails.destroy({
      where: { user_id: userId, meeting_id: meetingId },
    }),
};
