import { useQuery } from "@tanstack/react-query";
import fetchUserVote, { UserVote } from "core/queries/proposal/fetchUserVote";
import { proposalUserVoteFamily } from "core/state/proposal/proposalDetails";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useUserVote = (
  id: string,
  address: string,
  userVote: UserVote | null = null,
): FetchResult<UserVote> => {
  const [data, setProposalUserVote] = useRecoilState(
    proposalUserVoteFamily(id),
  );

  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["fetchUserVote", { id, address }],
    queryFn: () => fetchUserVote(id, address),
    initialData: userVote || data,
    enabled: !!address,
  });

  useEffect(() => {
    setProposalUserVote(fetchedData);
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
export default useUserVote;
