import { SessionData } from "#types/grammy.types.ts";
import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context, SessionFlavor } from "grammy";

declare global {
  type MyContext = Context &
    SessionFlavor<SessionData> &
    ConversationFlavor & {
      userId: number;
      chatId: number;
    };
  type MyConversation = Conversation<MyContext>;
}

export {};
