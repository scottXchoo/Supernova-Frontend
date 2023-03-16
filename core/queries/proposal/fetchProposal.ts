import { REST_BASE_URL } from "core/constants/urlConstants";
import {
  proposalTypeDisplay,
  ProposalTypeUrl,
  proposalStatusDisplay,
  ProposalStatus,
  Tally,
  Proposal,
} from "./types";

const fetchProposal = async (proposalId: string): Promise<Proposal | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals/${proposalId}`,
  );

  const data = await fetchResult.json();

  const {
    content: { description, title, "@type": type },
    deposit_end_time: depositEndTime,
    proposal_id: id,
    status,
    submit_time: submitTime,
    voting_end_time: votingEndTime,
    voting_start_time: votingStartTime,
  } = data.proposal;

  let tally: null | Tally;

  if (
    (status as ProposalStatus) === "PROPOSAL_STATUS_VOTING_PERIOD" ||
    (status as ProposalStatus) === "PROPOSAL_STATUS_DEPOSIT_PERIOD"
  ) {
    tally = null;
  } else {
    const {
      yes,
      no,
      abstain,
      no_with_veto: noWithVeto,
    } = data.proposal.final_tally_result;
    tally = {
      yes,
      no,
      abstain,
      noWithVeto,
    };
  }

  return {
    overview: {
      description,
      title,
      type: proposalTypeDisplay[type as ProposalTypeUrl],
      depositEndTime,
      id,
      status: status,
      statusDisplay: proposalStatusDisplay[status as ProposalStatus],
      submitTime,
      votingEndTime,
      votingStartTime,
    },
    tally,
  };
};
export default fetchProposal;
