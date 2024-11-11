import * as genK from "./generalKeyboards.js";
import * as meetingK from "./meetingsKeyboards.js";
import * as subK from "./subKeyboards.js";

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
