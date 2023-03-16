import { REST_BASE_URL } from "core/constants/urlConstants";

export const fetchCurrentDelegateBotVersion = async (
  zoneID: string,
): Promise<string | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/nova/gal/v1/delegate_version/${zoneID}`,
  );
  const data = await fetchResult.json();
  const { version: currentDelegateBotVersion } = data;

  return currentDelegateBotVersion;
};
