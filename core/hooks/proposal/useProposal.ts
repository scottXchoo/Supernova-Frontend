import { useQuery } from "@tanstack/react-query";
import fetchProposal from "core/queries/proposal/fetchProposal";
import { Proposal } from "core/queries/proposal/types";
import {
  proposalOverviewFamily,
  proposalTallyFamily,
} from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useProposal = (id: string): FetchResult<Proposal> => {
  const [overview, setProposalOverview] = useRecoilState(
    proposalOverviewFamily(id),
  );
  const [tally, setProposalTally] = useRecoilState(proposalTallyFamily(id));
  let proposal: Proposal | null;
  if (!overview) {
    proposal = null;
  } else {
    proposal = { overview, tally };
  }

  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["proposalOverview", id],
    queryFn: () => fetchProposal(id),
    initialData: proposal,
  });

  useEffect(() => {
    if (fetchedData) {
      setProposalOverview(fetchedData.overview);
      (!tally || fetchedData.tally) && setProposalTally(fetchedData.tally);
    }
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
    data: proposal,
    isLoading: false,
    error: null,
  };
};
export default useProposal;
