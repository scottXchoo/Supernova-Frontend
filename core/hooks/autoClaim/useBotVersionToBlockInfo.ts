import { useQuery } from "@tanstack/react-query";
import { fetchBlockTime } from "core/queries/autoClaim/fetchBlockTime";
import { fetchDelegateBotInfo } from "core/queries/autoClaim/fetchDelegateBotInfo";
import { BOT_SUCCESS_STATE } from "core/constants/constants";

export const useBotVersionToBlockInfo = (
  botVerison: number | null,
  zoneID: string,
) => {
  const {
    data: botInfo,
    error: botInfoError,
    isLoading: isBotInfoLoading,
  } = useQuery({
    queryKey: ["delegateBotInfo", zoneID, botVerison],
    queryFn: () => fetchDelegateBotInfo(zoneID, botVerison),
    enabled: !!botVerison && !!zoneID,
  });
  const {
    data: blockTime,
    error: blockTimeError,
    isLoading: isBlockTimeLoading,
  } = useQuery({
    queryKey: ["blockTime", zoneID, botVerison],
    queryFn: () => fetchBlockTime(botInfo?.height || "0"),
    enabled: !!botInfo && !!(botInfo?.state === BOT_SUCCESS_STATE),
  });

  const isLoading = isBotInfoLoading || isBlockTimeLoading;
  const error = botInfoError || blockTimeError;

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }
  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }
  return {
    data: {
      time: blockTime,
      height: botInfo?.height,
      botState: botInfo?.state,
    },
    isLoading: false,
    error: null,
  };
};
