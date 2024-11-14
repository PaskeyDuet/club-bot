const checkMessageLength = (str: string) => {
  const messageLimit = 4096;
  const attentionText =
    "Достигнута верхняя планка. Сообщение обрезано на 100 символов";
  if (str.length > messageLimit) {
    const slicedStr = str.slice(0, messageLimit - attentionText.length - 100);
    return `${slicedStr}\n${attentionText}`;
  }
  return str;
};

export { checkMessageLength };
