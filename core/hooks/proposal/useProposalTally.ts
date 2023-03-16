import { useQuery } from "@tanstack/react-query";
import fetchProposalTallyResult from "core/queries/proposal/fetchProposalTallyResult";
import { Tally } from "core/queries/proposal/types";
import { proposalTallyFamily } from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useProposalTally = (id: string, enabled: boolean): FetchResult<Tally> => {
  const [data, setProposalTally] = useRecoilState(proposalTallyFamily(id));
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["proposalTally", id],
    queryFn: () => fetchProposalTallyResult(id),
    initialData: data,
    enabled: enabled,
  });

  useEffect(() => {
    if (!data || fetchedData) setProposalTally(fetchedData);
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
export default useProposalTally;
