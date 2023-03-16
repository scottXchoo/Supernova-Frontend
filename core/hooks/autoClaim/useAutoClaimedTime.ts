import { useQuery } from "@tanstack/react-query";
import { fetchCurrentDelegateBotVersion } from "core/queries/autoClaim/fetchCurrentDelegateBotVersion";
import { fetchOracleInfo } from "core/queries/autoClaim/fetchOracleInfo";
import { useBotVersionToBlockInfo } from "./useBotVersionToBlockInfo";
import { fetchBlockTime } from "core/queries/autoClaim/fetchBlockTime";
import { currentDateForError } from "core/utils/dateTimeFormat";
import dayjs from "dayjs";
import {
  botAutoClaimPeriod,
  botOraclePeriod,
  BOT_PERIOD_UNIT,
  BOT_SUCCESS_STATE,
  DATE_FORMAT,
} from "core/constants/constants";
import useDelegationRecords from "./useDelegationRecords";

export const useAutoClaimedTime = (address: string, zoneID: string) => {
  const {
    data: currentBotVersion,
    error: currentBotVersionError,
    isLoading: isCurrentBotVersionLoading,
  } = useQuery({
    queryKey: ["currentDelegateBotVersion", zoneID],
    queryFn: () => fetchCurrentDelegateBotVersion(zoneID),
    enabled: !!address && !!zoneID,
  });
  const previousBotVersion = Number(currentBotVersion) - 1 || 0;
  const { data: blockInfo } = useBotVersionToBlockInfo(
    previousBotVersion,
    zoneID,
  );

  const {
    data: oracleInfo,
    error: oracleInfoError,
    isLoading: isOracleInfoLoading,
  } = useQuery({
    queryKey: ["oracleInfo", zoneID],
    queryFn: () => fetchOracleInfo(zoneID),
    enabled: !!zoneID,
  });

  const {
    data: oracleTime,
    error: oracleTimeError,
    isLoading: isOracleTimeLoading,
  } = useQuery({
    queryKey: ["blockTime", zoneID, oracleInfo?.version],
    queryFn: () => fetchBlockTime(oracleInfo?.height || "0"),
    enabled: !!oracleInfo && !!(blockInfo?.botState === BOT_SUCCESS_STATE),
  });

  const {
    data: versionInfo,
    error: versionInfoError,
    isLoading: isVersionInfoLoading,
  } = useDelegationRecords({
    address,
    zoneID,
  });

  const nextOracleBotTime = oracleTime
    ? dayjs(oracleTime)
        .add(botOraclePeriod + botAutoClaimPeriod, BOT_PERIOD_UNIT)
        .format(DATE_FORMAT)
    : currentDateForError;

  const currentOracleBotTime = oracleTime
    ? dayjs(oracleTime)
        .add(botAutoClaimPeriod, BOT_PERIOD_UNIT)
        .format(DATE_FORMAT)
    : currentDateForError;

  const oracleVersionByOracleVersion = Number(oracleInfo?.version);
  const oracleVersionByDelegateRecords = Number(versionInfo?.oracle);

  const actualAutoClaimedTime =
    oracleVersionByDelegateRecords === oracleVersionByOracleVersion
      ? nextOracleBotTime
      : currentOracleBotTime;

  const isLoading =
    isCurrentBotVersionLoading ||
    isOracleInfoLoading ||
    isOracleTimeLoading ||
    isVersionInfoLoading;

  const error =
    currentBotVersionError ||
    oracleInfoError ||
    oracleTimeError ||
    versionInfoError;

  if (isLoading) {
    return {
      data: null,
      isLoading: isLoading,
      error: null,
    };
  }
  if (error) {
    return {
      data: null,
      isLoading: isLoading,
      error: error as Error,
    };
  }
  return {
    data:
      !!versionInfo && versionInfo.oracle !== "0"
        ? actualAutoClaimedTime
        : null,
    isLoading: false,
    error: null,
  };
};
