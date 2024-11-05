import * as genK from "./generalKeyboards.ts";
import * as meetingK from "./meetingsKeyboards.ts";
import * as subK from "./subKeyboards.ts";

export const {
  greetingKeyboard,
  infoKeyboards,
  mainMenu,
  adminMenuKeyboard,
  adminMenu,
} = genK;

export const {
  meetingCreatedMenu,
  meetingCreateCheckKeyboard,
  meetingRegApprovedKeyboard,
  generateMeetingsKeyboard,
  cancelMeetingRegApproveKeyboard,
  manageMeeting,
} = meetingK;

export const { subKeyboard, waitForPayKeyboard, subPaymentManaginKeyboard } =
  subK;
