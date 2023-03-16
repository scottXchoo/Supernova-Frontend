import { REST_BASE_URL } from "core/constants/urlConstants";

export type UnbondingRecord = {
  validatorAddress: string;
  balance: string;
  completionTime: string;
};

type UnbondingDelegation = {
  delegator_address: string;
  validator_address: string;
  entries: UnbondingDelegationEntry[];
};
type UnbondingDelegationEntry = {
  creation_height: Long;
  completion_time?: Date;
  initial_balance: string;
  balance: string;
};

const fetchUnbondingRecords = async (
  delegatorAddress: string,
): Promise<UnbondingRecord[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/delegators/${delegatorAddress}/unbonding_delegations`,
  );

  const data = await fetchResult.json();
  const unbondingResponses = data.unbonding_responses;
  if (unbondingResponses.length == 0) return null;
  const unbondingRecords = unbondingResponses.map(
    (response: UnbondingDelegation) => {
      return response.entries.map((entry: UnbondingDelegationEntry) => {
        return {
          validatorAddress: response.validator_address,
          balance: entry.balance,
          completionTime: entry.completion_time,
        };
      });
    },
  );
  return unbondingRecords.flat();
};

export default fetchUnbondingRecords;
