import { REST_BASE_URL } from "core/constants/urlConstants";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export type UserVote = {
  id: string;
  voter: string;
  option: keyof VoteOption;
};

const fetchIsUserDelegate = async (address: string): Promise<boolean> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/delegations/${address}`,
  );
  const data = await fetchResult.json();
  const hasUserDelegated = !!data.delegation_responses.length;
  return hasUserDelegated;
};
export default fetchIsUserDelegate;
