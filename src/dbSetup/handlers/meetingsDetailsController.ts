import MeetingsDetails from "../models/MeetingsDetails";

export default {
  findAll: () => MeetingsDetails.findAll(),
  addUserToMeet: async (userId: number, meetingId: number) => {
    return await MeetingsDetails.create({
      user_id: userId,
      meeting_id: meetingId,
    });
  },
};
