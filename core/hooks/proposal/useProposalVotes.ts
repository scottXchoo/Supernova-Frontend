import { useQuery } from "@tanstack/react-query";
import fetchProposalVotes from "core/queries/proposal/fetchProposalVotes";
import { Votes } from "core/queries/proposal/types";
import { proposalVotesFamily } from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useProposalVotes = (
  id: string,
  votes: Votes[] | null = null,
): FetchResult<Votes[]> => {
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["proposalVotes", id],
    queryFn: () => fetchProposalVotes(id),
    initialData: votes,
  });

  const [data, setProposalVotes] = useRecoilState(proposalVotesFamily(id));

  useEffect(() => {
    setProposalVotes(fetchedData);
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
    data,
    isLoading: false,
    error: null,
  };
};
export default useProposalVotes;
