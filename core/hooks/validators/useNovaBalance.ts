import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import fetchNovaBalance, {
  NovaBalance,
} from "core/queries/validators/fetchNovaBalance";

const useNovaBalance = (
  address: string,
): FetchResult<NovaBalance | undefined> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["novaBalance", address],
    queryFn: () => fetchNovaBalance(address),
    enabled: !!address,
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
    isLoading,
    error: null,
  };
};

export default useNovaBalance;
