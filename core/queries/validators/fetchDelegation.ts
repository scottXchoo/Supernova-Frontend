import { REST_BASE_URL } from "core/constants/urlConstants";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const fetchDelegation = async (
  delegatorAddress: string,
  validatorAddress: string,
): Promise<Coin | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/validators/${validatorAddress}/delegations/${delegatorAddress}`,
  );

  const data = await fetchResult.json();
  const delegation = data.delegation_response.balance;
  return delegation;
};

export default fetchDelegation;
