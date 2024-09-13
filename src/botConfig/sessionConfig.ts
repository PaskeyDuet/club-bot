import { SessionData } from "../interfaces";

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
