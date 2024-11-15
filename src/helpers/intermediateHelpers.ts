const checkMessageLength = (str: string) => {
  const messageLimit = 4096;
  if (str.length > messageLimit) {
    throw new Error(
      `Был передан текст превышающий ${messageLimit} символов! Его начало:\n${str.slice(0, 40)}...\n`
    );
  }
};

export { checkMessageLength };
