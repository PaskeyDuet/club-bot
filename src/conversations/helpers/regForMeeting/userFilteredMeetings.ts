import {
  MeetingsObject,
  MeetingsWithDetailsObject,
} from "../../../types/shared.types";

export default (
  futureMeetings: MeetingsObject[],
  futureMeetingsWithUsers: MeetingsWithDetailsObject[]
) => {
  const f1 = futureMeetings.map((el) => el.meetingId);
  const f2 = futureMeetingsWithUsers;
  return f2.filter((el) => !f1.includes(el.meetingId));
};
