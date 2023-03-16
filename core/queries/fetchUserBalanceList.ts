import { REST_BASE_URL } from "core/constants/urlConstants";

export type UserBalance = {
  denom: string;
  amount: string;
};

const fetchUserBalanceList = async (
  address: string,
): Promise<UserBalance[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/bank/v1beta1/balances/${address}`,
  );

  const data = await fetchResult.json();
  const allBalances = data.balances;

  return allBalances as UserBalance[];
};

export default fetchUserBalanceList;
