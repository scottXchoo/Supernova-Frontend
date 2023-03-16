import { REST_BASE_URL } from "core/constants/urlConstants";
import { Tally } from "./types";

const fetchProposalTallyResult = async (
  proposalId: string,
): Promise<Tally | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`,
  );

  const data = await fetchResult.json();

  const { yes, no, abstain, no_with_veto: noWithVeto } = data.tally;

  return {
    yes,
    no,
    abstain,
    noWithVeto,
  };
};
export default fetchProposalTallyResult;
