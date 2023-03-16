import {
  ProposalDeposits,
  ProposalOverview,
  Tally,
  Votes,
} from "core/queries/proposal/types";
import { UserVote } from "core/queries/proposal/fetchUserVote";
import { atom, atomFamily } from "recoil";

export const proposalOverviewFamily = atomFamily<
  ProposalOverview | null,
  string
>({
  key: "proposalOverviewFamily",
  default: null,
});

export const proposalTallyFamily = atomFamily<Tally | null, string>({
  key: "proposalTallyFamily",
  default: null,
});

export const proposalDepositsFamily = atomFamily<
  ProposalDeposits | null,
  string
>({
  key: "proposalDepositsFamily",
  default: null,
});

export const proposalVotesFamily = atomFamily<Votes[] | null, string>({
  key: "proposalVotes",
  default: null,
});

export const proposalUserVoteFamily = atomFamily<UserVote | null, string>({
  key: "proposalUserVote",
  default: null,
});

export const proposalIds = atom<string[]>({
  key: "proposalIds",
  default: [],
});
