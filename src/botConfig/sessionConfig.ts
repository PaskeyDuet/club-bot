import { SessionData } from "../types/grammy.types";

const initialConfig: SessionData = {
  user: {
    fio: "",
    isNewbie: true,
  },
  routeHistory: [],
  lastMsgId: 0,
  editMode: true,
};

export default initialConfig;
