import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { getNovaAddress, getWasmClient } from "core/state/coreState";
import { PairInfo } from "core/config/pairInfo";
import { contracts } from "supernovajs-contracts";
import { useMemo } from "react";

const useStakedLpTokens = (pair?: PairInfo) => {
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);

  const fetchStakedLpTokens = useMemo(() => {
    if (!wasmClient || !novaAddress || !pair) {
      return null;
    }

    return async function fetchStakedLpTokens() {
      const queryClient = new contracts.NovaVault.NovaVaultQueryClient(
        wasmClient,
        pair.vaultContractAddress,
      );

      const fetchResult = await queryClient.userInfo({ user: novaAddress });
      const { amount, reward_debt: rewardDebt } = fetchResult.info;
      return {
        amount,
        rewardDebt,
      };
    };
  }, [wasmClient, novaAddress, pair]);

  const pairKey = pair ? `${pair.asset0.denom}/${pair.asset1.denom}` : "";
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "stakedLpTokens",
      {
        address: novaAddress,
        pair: pairKey,
      },
    ],
    queryFn: () => fetchStakedLpTokens?.(),
    enabled: !!fetchStakedLpTokens,
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
    data: data,
    isLoading: false,
    error: null,
  };
};

export default useStakedLpTokens;
