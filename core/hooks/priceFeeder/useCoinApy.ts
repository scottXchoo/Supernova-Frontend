import { useQuery } from "@tanstack/react-query";
import fetchCoinApy from "core/queries/priceFeeder/fetchCoinApy";

const useCoinApy = (zoneName: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["coinApy", zoneName],
    queryFn: () => fetchCoinApy(zoneName),
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

export default useCoinApy;
