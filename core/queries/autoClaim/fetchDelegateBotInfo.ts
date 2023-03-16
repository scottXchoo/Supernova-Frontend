import { REST_BASE_URL } from "core/constants/urlConstants";

export enum BotState {
  Idle = "1",
  Pending = "2",
  Success = "3",
  Fail = "4",
}

type DelegateBotInfo = {
  height: string;
  state: BotState;
};

export const fetchDelegateBotInfo = async (
  zoneID: string,
  version: number | null,
): Promise<DelegateBotInfo | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/nova/gal/v1/delegate_version/${zoneID}/${version}`,
  );
  const data = await fetchResult.json();
  const { height, state } = data.version_info;
  const delegateBotInfo = { height, state };

  return delegateBotInfo;
};
