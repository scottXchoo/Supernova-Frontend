import { REST_BASE_URL } from "core/constants/urlConstants";

export type OracleInfoData = {
  version: string;
  height: string;
};

export const fetchOracleInfo = async (
  zoneID: string,
): Promise<OracleInfoData | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/nova/oracle/v1/oracle_version/${zoneID}`,
  );
  const data = await fetchResult.json();

  const { version, height } = data as OracleInfoData;

  const oracleInfo = {
    version,
    height,
  };

  return oracleInfo;
};
