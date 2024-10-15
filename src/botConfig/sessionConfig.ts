import { SessionData } from "../types/grammy.types";

const initialConfig: SessionData = {
  user: {
    firstName: "",
    secondName: "",
    isNewbie: true,
    hasSub: false,
  },
  temp: {
    meetingNumber: null,
  },
  routeHistory: [],
  lastMsgId: 0,
  editMode: true,
  conversation: {},
};

export default initialConfig;
