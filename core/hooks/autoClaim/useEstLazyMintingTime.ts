import { useQuery } from "@tanstack/react-query";
import { fetchCurrentDelegateBotVersion } from "core/queries/autoClaim/fetchCurrentDelegateBotVersion";
import {
  botDelegatePeriod,
  BOT_PERIOD_UNIT,
  DATE_FORMAT,
} from "core/constants/constants";
import { currentDateForError } from "core/utils/dateTimeFormat";
import { useBotVersionToBlockInfo } from "./useBotVersionToBlockInfo";
import dayjs from "dayjs";

export const useEstLazyMintingTime = (zoneID: string) => {
  const {
    data: currentBotVersion,
    error: currentBotVersionError,
    isLoading: isCurrentBotVersionLoading,
  } = useQuery({
    queryKey: ["currentDelegateBotVersion", zoneID],
    queryFn: () => fetchCurrentDelegateBotVersion(zoneID),
    enabled: !!zoneID,
  });

  const previousBotVersion = Number(currentBotVersion) - 1 || 0;
  const { data: blockInfo } = useBotVersionToBlockInfo(
    previousBotVersion,
    zoneID,
  );

  const estLazyMintingTime = blockInfo
    ? dayjs(blockInfo?.time)
        .add(botDelegatePeriod, BOT_PERIOD_UNIT)
        .format(DATE_FORMAT)
    : currentDateForError;

  return {
    data: estLazyMintingTime,
    isLoading: isCurrentBotVersionLoading,
    error: currentBotVersionError as Error,
  };
};
