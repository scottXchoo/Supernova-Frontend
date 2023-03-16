import { useQuery } from "@tanstack/react-query";
import fetchProposalDeposits from "core/queries/proposal/fetchProposalDeposits";
import { ProposalDeposits } from "core/queries/proposal/types";
import { proposalDepositsFamily } from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useProposalDeposits = (
  id: string,
  deposits: ProposalDeposits | null = null,
): FetchResult<ProposalDeposits> => {
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["proposalDeposits", id],
    queryFn: () => fetchProposalDeposits(id),
    initialData: deposits,
  });

  const [data, setProposalDeposits] = useRecoilState(
    proposalDepositsFamily(id),
  );

  useEffect(() => {
    setProposalDeposits(fetchedData);
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
export default useProposalDeposits;
