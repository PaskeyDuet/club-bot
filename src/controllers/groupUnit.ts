import groupsMembersController from "#db/handlers/groupsMembersController.js";
import usersController from "#db/handlers/usersController.js";
import usersGroupsHandler from "#db/handlers/usersGroupsHandler.js";
import logErrorAndThrow from "#handlers/logErrorAndThrow.js";
import sanitizedConfig from "#root/config.js";
import type { MyContext } from "#types/grammy.types.js";

const groupInit = async (ctx: MyContext) => {
  const adminIds = sanitizedConfig.ADMIN_IDS;
  const isAdmin = adminIds.includes(`${ctx.userId}`);
  if (!(ctx.chat?.type === "group") && !isAdmin) {
    return;
  }

  try {
    const group_id = ctx.chatId;
    const groupExists = await usersGroupsHandler.findGroup({ group_id });

    if (!groupExists) {
      await usersGroupsHandler.createGroup({
        trial_period: true,
        group_id,
      });
      await ctx.reply(groupInitH.created);
      return;
    }
    throw new Error(groupInitH.alreadyExists);
  } catch (err) {
    const error = err as Error;
    if (error.message === groupInitH.alreadyExists) {
      await ctx.reply(groupInitH.alreadyExists);
    } else logErrorAndThrow(err, "error", groupInitH.unknownErr);
  }
};
const groupInitH = {
  alreadyExists: "Инициализация данной группы уже была проведена",
  created: "Группа была успешно инициализирована",
  unknownErr: "Ошибка при попытке инициализировать группу",
};

const addUserToGroup = async (ctx: MyContext) => {
  const { userId: user_id, chatId: group_id } = ctx;
  console.log(user_id, group_id);

  const groupExists = await usersGroupsHandler.findGroup({ group_id });
  const userExists = await usersController.findUser({ user_id });
  if (groupExists) {
    if (!userExists) {
      await usersController.createUserWithId(user_id);
    }
    await groupsMembersController.createMembership({ user_id, group_id });
  } else {
    return;
    //TODO: Notificate admin
  }
  await ctx.reply("User created");
};

export { groupInit, addUserToGroup };
