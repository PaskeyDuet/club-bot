import sanitizedConfig from "#root/config.js";
import type { MyContext, MyConversation } from "#types/grammy.types.js";
import { hydrateFiles } from "@grammyjs/files";
const token = sanitizedConfig.BOT_API_TOKEN;
//TODO: Make it middleware
export default (ctx: MyContext) => ctx.api.config.use(hydrateFiles(token));
