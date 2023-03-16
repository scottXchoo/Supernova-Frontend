import { useQuery } from "@tanstack/react-query";
import fetchAllProposals from "core/queries/proposal/fetchAllProposals";
import { Proposal, ProposalStatusCode } from "core/queries/proposal/types";
import {
  proposalIds,
  proposalOverviewFamily,
  proposalTallyFamily,
} from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilCallback } from "recoil";
import { FetchResult } from "../type";

const useProposals = (
  status: ProposalStatusCode = 0,
): FetchResult<Proposal[]> => {
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["proposals", status],
    queryFn: () => fetchAllProposals(status),
  });

  const setProposals = useRecoilCallback(
    ({ set }) =>
      (proposal: Proposal) => {
        set(proposalIds, (prev) => [...prev, proposal.overview.id]);
        set(proposalOverviewFamily(proposal.overview.id), proposal.overview);
        if (proposal.tally)
          set(proposalTallyFamily(proposal.overview.id), proposal.tally);
      },
    [],
  );

  useEffect(() => {
    fetchedData?.map((proposal: Proposal) => setProposals(proposal));
  }, [fetchedData]);

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }
  return {
    data: fetchedData,
    isLoading,
    error: null,
  };
};
export default useProposals;
