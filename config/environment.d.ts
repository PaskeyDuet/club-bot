import { SessionData } from "#types/grammy.types.ts";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_API_KEY: string;
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: number;
    }
    type GlobalConfig = {
      maxmeetingsPerMessage: number;
    };
  }
}

export {};
