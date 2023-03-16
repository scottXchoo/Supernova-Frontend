import { REST_BASE_URL } from "core/constants/urlConstants";

export const fetchBlockTime = async (
  height: string,
): Promise<string | null> => {
  if (height === "0") return null;
  const fetchResult = await fetch(`${REST_BASE_URL}/blocks/${height}`);
  const data = await fetchResult.json();
  const { time: blockTime } = data.block.header;

  return blockTime;
};
