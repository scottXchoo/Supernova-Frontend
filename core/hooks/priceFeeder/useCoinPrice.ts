import { useQuery } from "@tanstack/react-query";
import fetchCoinPrice from "core/queries/priceFeeder/fetchCoinPrice";

const useCoinPrice = (zoneName: string) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["coinPrice", zoneName],
    queryFn: () => fetchCoinPrice(zoneName),
    enabled: !!zoneName,
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

export default useCoinPrice;
