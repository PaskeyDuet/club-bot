import * as genK from "./generalKeyboards.js";
import * as meetingK from "./meetingsKeyboards.js";
import * as subK from "./subKeyboards.js";

export const {
  greetingKeyboard,
  infoKeyboards,
  mainMenu,
  adminMenuKeyboard,
  adminMenu,
  backButton,
} = genK;

export const {
  meetingCreatedMenu,
  meetingCreateCheckKeyboard,
  meetingRegApprovedKeyboard,
  generateMeetingsKeyboard,
  cancelMeetingRegApproveKeyboard,
  adminManageMeeting,
  meetingVisitNotificationKeyboard,
  userManageMeeting,
} = meetingK;

export const { subKeyboard, waitForPayKeyboard, subPaymentManaginKeyboard } =
  subK;
