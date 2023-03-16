import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import { Coin, SigningStargateClient } from "@cosmjs/stargate";
import fetchChainBalance from "core/queries/assets/fetchChainBalance";

const useChainBalance = (
  client: SigningStargateClient,
  address: string,
  denom: string,
): FetchResult<Coin | undefined> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["chainBalance", client, address, denom],
    queryFn: () => fetchChainBalance(client, address, denom),
    enabled: !!(client && address && denom),
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

export default useChainBalance;
