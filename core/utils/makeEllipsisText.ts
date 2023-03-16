const ELLIPSIS_TEXT_LENGTH = 19;
const START_TEXT_LENGTH = 12;
const END_TEXT_LENGTH = 7;
export const makeEllipsisText = (text: string): string => {
  if (!text || text.length <= ELLIPSIS_TEXT_LENGTH) return text;
  const startText = text.slice(0, START_TEXT_LENGTH);
  const endText = text.slice(-END_TEXT_LENGTH);
  return startText + "..." + endText;
};
