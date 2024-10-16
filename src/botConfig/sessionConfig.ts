import { SessionData } from "../types/grammy.types";

const initialConfig: SessionData = {
  user: {
    firstName: "",
    secondName: "",
    isNewbie: false,
    hasSub: false,
  },
  temp: {
    meetingNumber: null,
    sub_number: null,
  },
  routeHistory: [],
  lastMsgId: 0,
  editMode: true,
  conversation: {},
};

export default initialConfig;
