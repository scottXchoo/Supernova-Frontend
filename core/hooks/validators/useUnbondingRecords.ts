import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import fetchUnbondingRecords, {
  UnbondingRecord,
} from "core/queries/validators/fetchUnbondingRecords";

const useUnbondingRecords = (
  delegatorAddress: string,
): FetchResult<UnbondingRecord[] | null> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["unbondingRecords", delegatorAddress],
    queryFn: () => fetchUnbondingRecords(delegatorAddress),
    enabled: !!delegatorAddress,
  });

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

export default useUnbondingRecords;
