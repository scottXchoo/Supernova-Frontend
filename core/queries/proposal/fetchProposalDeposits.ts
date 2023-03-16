import { REST_BASE_URL } from "core/constants/urlConstants";
import { ProposalDeposits } from "./types";

const fetchProposalDeposits = async (
  proposalId: string,
): Promise<ProposalDeposits | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/gov/v1beta1/proposals/${proposalId}/deposits`,
  );
  const data = await fetchResult.json();
  const hasDeposits = !!data.deposits.length;
  if (!hasDeposits) {
    return null;
  }
  const { depositor } = data.deposits[0]; //TODO: need to check proposer is first value of deposits array

  return {
    depositor,
  };
};
export default fetchProposalDeposits;
