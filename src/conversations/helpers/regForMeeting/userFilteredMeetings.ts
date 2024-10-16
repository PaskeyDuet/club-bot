import {
  MeetingsObject,
  MeetingsWithDetailsObject,
} from "../../../types/shared.types";

export default (
  futureMeetings: MeetingsObject[],
  futureMeetingsWithUsers: MeetingsWithDetailsObject[]
) => {
  if (!futureMeetingsWithUsers.length) {
    return futureMeetings;
  }
  const f1 = futureMeetings;
  const f2 = futureMeetingsWithUsers.map((el) => el.meetingId);
  return f1.filter((el) => !f2.includes(el.meetingId));
};
