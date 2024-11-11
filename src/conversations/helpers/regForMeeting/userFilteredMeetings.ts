import {
  MeetingObjectWithId,
  MeetingsWithDetailsObject,
} from "#types/shared.types.js";

export default (
  futureMeetings: MeetingObjectWithId[],
  futureMeetingsWithUsers: MeetingsWithDetailsObject[]
) => {
  console.log("future meetings", futureMeetings);
  console.log("future meetings with users", futureMeetingsWithUsers);

  const f1 = futureMeetings;
  console.log("futureMeetings", futureMeetings);
  const f2 = futureMeetingsWithUsers.map((el) => el.meetingId);
  console.log("futureMeetingsWithUsersmapped", f2);
  return f1.filter((el) => !f2.includes(el.meetingId));
};
