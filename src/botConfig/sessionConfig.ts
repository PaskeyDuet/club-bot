import type { SessionData } from "#types/grammy.types.js";

const initialConfig: SessionData = {
  user: {
    firstName: "",
    secondName: "",
    isNewbie: false,
    hasSub: false,
    subEndDate: "",
    subNumber: -1,
  },
  temp: {
    meetingNumber: null,
    feedbackMeetingId: null,
    sub_number: null,
  },
  routeHistory: [],
  lastMsgId: 0,
  editMode: true,
  conversation: {},
};

export default initialConfig;
