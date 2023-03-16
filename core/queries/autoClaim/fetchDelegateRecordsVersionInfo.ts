import { REST_BASE_URL } from "core/constants/urlConstants";

type VersionInfo = {
  bot: string;
  oracle: string;
};

export const fetchDelegateRecordsToVerionInfo = async (
  address: string,
  zoneID: string,
): Promise<VersionInfo | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/nova/gal/v1/delegate/${address}/${zoneID}`,
  );

  const data = await fetchResult.json();
  // Last key value of object(or array) = Latest bot version
  const delegateRecord = data.delegateRecord?.records;
  if (!delegateRecord) return null;

  const botVersion = Object.keys(delegateRecord).pop() || "0";
  const oracleVersion = delegateRecord[botVersion].oracle_version as string;

  const versionInfo = {
    bot: botVersion,
    oracle: oracleVersion,
  };
  return versionInfo || null;
};
