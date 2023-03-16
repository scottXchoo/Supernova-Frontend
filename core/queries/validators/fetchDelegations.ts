import { REST_BASE_URL } from "core/constants/urlConstants";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

export type Delegation = {
  validatorAddress: string;
  balance: Coin;
};

type DelegationResponse = {
  delegation: {
    delegator_address: string;
    validator_address: string;
    shares: string;
  };
  balance: {
    denom: string;
    amount: string;
  };
};
const fetchDelegations = async (
  delegatorAddress: string,
): Promise<Delegation[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`,
  );

  const data = await fetchResult.json();
  const delegationResponses: DelegationResponse[] = data.delegation_responses;
  const delegations: Delegation[] = delegationResponses.map(
    (delegationResponse) => {
      return {
        validatorAddress: delegationResponse.delegation.validator_address,
        balance: {
          amount: delegationResponse.balance.amount,
          denom: delegationResponse.balance.denom,
        },
      };
    },
  );
  return delegations;
};

export default fetchDelegations;
