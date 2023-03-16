import { REST_BASE_URL } from "core/constants/urlConstants";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export type UserVote = {
  id: string;
  voter: string;
  option: keyof VoteOption;
};

const fetchUserVote = async (
  proposalId: string,
  address: string,
): Promise<UserVote | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals/${proposalId}/votes/${address}`,
  );

  const data = await fetchResult.json();
  const { proposal_id: id, voter, option } = data.vote;

  return {
    id,
    voter,
    option,
  };
};
export default fetchUserVote;
