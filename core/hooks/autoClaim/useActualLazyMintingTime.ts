import { currentDateForError } from "./../../utils/dateTimeFormat";
import { useBotVersionToBlockInfo } from "./useBotVersionToBlockInfo";
import { DATE_FORMAT } from "core/constants/constants";
import dayjs from "dayjs";
import useDelegationRecords from "./useDelegationRecords";

export const useActualLazyMintingTime = (address: string, zoneID: string) => {
  const {
    data: versionInfo,
    error: versionInfoError,
    isLoading: isVersionInfoLoading,
  } = useDelegationRecords({
    address,
    zoneID,
  });

  const { data: blockInfo } = useBotVersionToBlockInfo(
    versionInfo ? Number(versionInfo?.bot) : null,
    zoneID,
  );

  const actualLazyMintingTime = blockInfo
    ? dayjs(blockInfo?.time).format(DATE_FORMAT)
    : currentDateForError;

  if (isVersionInfoLoading) {
    return {
      data: null,
      isLoading: isVersionInfoLoading,
      error: null,
    };
  }
  if (versionInfoError) {
    return {
      data: null,
      isLoading: isVersionInfoLoading,
      error: versionInfoError as Error,
    };
  }
  return {
    data: blockInfo?.time ? actualLazyMintingTime : null,
    isLoading: false,
    error: null,
  };
};
