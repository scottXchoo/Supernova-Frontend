import { REST_BASE_URL } from "core/constants/urlConstants";
import { UNOVA_MINIMAL_DENOM } from "core/constants/constants";

export type NovaBalance = {
  denom: string;
  amount: string;
};

const fetchNovaBalance = async (
  address: string,
): Promise<NovaBalance | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${UNOVA_MINIMAL_DENOM}`,
  );

  const data = await fetchResult.json();

  const { denom, amount } = data.balance;

  return {
    denom,
    amount,
  };
};

export default fetchNovaBalance;
