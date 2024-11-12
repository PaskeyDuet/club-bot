import type {
  MeetingObjectWithId,
  MeetingsWithDetailsObject,
} from "#types/shared.types.js";

export default (
  futureMeetings: MeetingObjectWithId[],
  futureMeetingsWithUsers: MeetingsWithDetailsObject[]
) => {
  const f1 = futureMeetings;
  const f2 = futureMeetingsWithUsers.map((el) => el.meetingId);
  return f1.filter((el) => !f2.includes(el.meetingId));
};
