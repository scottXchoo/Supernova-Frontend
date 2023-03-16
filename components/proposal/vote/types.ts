import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export const voteOptionString: Record<VoteOption, string | null> = {
  [VoteOption.UNRECOGNIZED]: null,
  [VoteOption.VOTE_OPTION_UNSPECIFIED]: null,
  [VoteOption.VOTE_OPTION_YES]: "Yes",
  [VoteOption.VOTE_OPTION_ABSTAIN]: "Abstain",
  [VoteOption.VOTE_OPTION_NO]: "No",
  [VoteOption.VOTE_OPTION_NO_WITH_VETO]: "No+Veto",
};

export const defaultButtonColor: Record<VoteOption, string> = {
  [VoteOption.UNRECOGNIZED]: "bg-gray-500",
  [VoteOption.VOTE_OPTION_UNSPECIFIED]: "bg-gray-500",
  [VoteOption.VOTE_OPTION_YES]: "bg-yellow-500",
  [VoteOption.VOTE_OPTION_ABSTAIN]: "bg-purple-300",
  [VoteOption.VOTE_OPTION_NO]: "bg-purple-500",
  [VoteOption.VOTE_OPTION_NO_WITH_VETO]: "bg-red-500",
};
