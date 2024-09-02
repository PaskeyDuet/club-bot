declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_API_KEY: string;
    }
  }
}

export {};
