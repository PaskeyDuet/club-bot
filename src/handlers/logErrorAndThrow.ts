import { loggerLevelsType } from "#types/shared.types";
import logger from "#root/logger.js";

export default (err: unknown, logLevel: loggerLevelsType, context: string) => {
  const error = err as Error;
  logger[logLevel](`${context}: \n${error.message}`);
  throw new Error(error.message);
};
