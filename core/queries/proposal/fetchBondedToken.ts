import { REST_BASE_URL } from "core/constants/urlConstants";

const fetchBondedToken = async (): Promise<string | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/pool`,
  );

  const data = await fetchResult.json();
  const { bonded_tokens: bondedToken } = data.pool;

  return bondedToken;
};
export default fetchBondedToken;
