import { useQuery } from "@tanstack/react-query";
import { PairInfo } from "core/config/pairInfo";
import { getWasmClient, getNovaAddress } from "core/state/coreState";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { contracts } from "supernovajs-contracts";
import { FetchResult } from "../proposal/type";

const useClaimableAmount = (pair: PairInfo): FetchResult<string> => {
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);

  const fetchClaimableAmount = useMemo(() => {
    if (!wasmClient || !novaAddress || !pair) {
      return null;
    }

    return async function fetchClaimableAmount() {
      const queryClient = new contracts.NovaVault.NovaVaultQueryClient(
        wasmClient,
        pair.vaultContractAddress,
      );

      const fetchResult = await queryClient.claimableAmount({
        user: novaAddress,
      });
      const { pending_reward: pendingReward } = fetchResult;
      return { pendingReward };
    };
  }, [wasmClient, novaAddress, pair]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["claimableAmount", `${pair.asset0.denom}/${pair.asset1.denom}`],
    queryFn: () => fetchClaimableAmount?.(),
    enabled: !!fetchClaimableAmount,
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
    data: data?.pendingReward || null,
    isLoading: false,
    error: null,
  };
};

export default useClaimableAmount;
