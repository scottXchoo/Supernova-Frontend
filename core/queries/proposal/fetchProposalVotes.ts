import { REST_BASE_URL } from "core/constants/urlConstants";
import { Votes } from "./types";

type VoteOption =
  | "VOTE_OPTION_YES"
  | "VOTE_OPTION_NO"
  | "VOTE_OPTION_ABSTAIN"
  | "VOTE_OPTION_NO_WITH_VETO";

const voteOptionDisplay: Record<VoteOption, string> = {
  VOTE_OPTION_YES: "Yes",
  VOTE_OPTION_NO: "No",
  VOTE_OPTION_ABSTAIN: "Abstain",
  VOTE_OPTION_NO_WITH_VETO: "No+Veto",
};

const fetchProposalVotes = async (
  proposalId: string,
): Promise<Votes[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals/${proposalId}/votes`,
  );

  const data = await fetchResult.json();

  const votes: Votes[] = data.votes.map((vote: Votes) => ({
    voter: vote.voter,
    option: voteOptionDisplay[vote.option as VoteOption],
  }));

  return votes;
};
export default fetchProposalVotes;
