import { sequelize } from "#db/dbClient.js";
import usersGroupsHandler from "#db/handlers/usersGroupsHandler.js";
import type { MyContext } from "#types/grammy.types.js";

const groupInit = async (ctx: MyContext) => {
  console.log("unf");
  const testGroupId = "-4559345457";

  if (!(ctx.chat?.type === "group")) {
    console.log(ctx.chat?.type);

    return;
  }
  const transaction = await sequelize.transaction();

  try {
    const chat_id = ctx.chatId;
    const groupExists = await usersGroupsHandler.findGroup({ chat_id });
    console.log(groupExists);

    if (!groupExists) {
      const createdGroup = await usersGroupsHandler.createGroup(
        {
          trial_period: true,
          chat_id,
        },
        transaction
      );
      console.log(createdGroup);
      await transaction.commit();
      return;
    }
    throw new Error(errorTypes.alreadyExists);
  } catch (err) {
    const error = err as Error;
    if (error.message) await transaction.rollback();
  }
};
const errorTypes = {
  alreadyExists: "Инициализация данной группы уже была проведена",
};

export { groupInit };
