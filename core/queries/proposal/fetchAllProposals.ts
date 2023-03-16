import { REST_BASE_URL } from "core/constants/urlConstants";
import {
  proposalTypeDisplay,
  ProposalTypeUrl,
  proposalStatusDisplay,
  ProposalStatus,
  Tally,
  Proposal,
  ProposalStatusCode,
} from "./types";

const fetchAllProposals = async (
  status: ProposalStatusCode,
): Promise<Proposal[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals?proposal_status=${status}`,
  );

  const data = await fetchResult.json();

  if (data.proposals.length === 0) {
    return [];
  }

  const proposals: Proposal[] = data.proposals.map((proposalOverview: any) => {
    const {
      content: { description, title, "@type": type },
      deposit_end_time: depositEndTime,
      proposal_id: id,
      status,
      submit_time: submitTime,
      voting_end_time: votingEndTime,
      voting_start_time: votingStartTime,
    } = proposalOverview;
    const overview = {
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
    };

    if (
      (status as ProposalStatus) === "PROPOSAL_STATUS_VOTING_PERIOD" ||
      (status as ProposalStatus) === "PROPOSAL_STATUS_DEPOSIT_PERIOD"
    ) {
      return {
        overview: overview,
        tally: null,
      };
    } else {
      const {
        yes,
        no,
        abstain,
        no_with_veto: noWithVeto,
      } = proposalOverview.final_tally_result;
      const tally: Tally = {
        yes,
        no,
        abstain,
        noWithVeto,
      };

      return {
        overview: overview,
        tally: tally,
      };
    }
  });

  proposals.sort((a, b) => Number(b.overview.id) - Number(a.overview.id));

  return proposals;
};
export default fetchAllProposals;
