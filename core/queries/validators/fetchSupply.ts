import { REST_BASE_URL } from "core/constants/urlConstants";
import { UNOVA_MINIMAL_DENOM } from "core/constants/constants";

export type Supply = {
  denom: string;
  amount: string;
};

const fetchSupply = async (): Promise<Supply | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/bank/v1beta1/supply/${UNOVA_MINIMAL_DENOM}`,
  );

  const data = await fetchResult.json();

  const { denom, amount } = data.amount;

  return {
    denom,
    amount,
  };
};

export default fetchSupply;
