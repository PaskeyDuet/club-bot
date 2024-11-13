import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import path from "node:path";
import dotenv from "dotenv";
import type { Config } from "#types/shared.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

type ENV = {
  BOT_API_TOKEN: string | undefined;
  DB_NAME: string | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
};

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    BOT_API_TOKEN: process.env.BOT_API_TOKEN,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
