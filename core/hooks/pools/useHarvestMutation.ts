import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultChainInfo } from "core/config/chainInfo";
import { PairInfo } from "core/config/pairInfo";
import { getWasmClient, getNovaAddress } from "core/state/coreState";
import { executeContractTx } from "core/txs/executeContractTx";
import { useRecoilValue } from "recoil";
import { contracts } from "supernovajs-contracts";
import { useChainAssets } from "../useAssets";

const useHarvestMutation = (pair: PairInfo) => {
  const queryClient = useQueryClient();
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const { refetchChainAssets } = useChainAssets(defaultChainInfo.chainId);

  const harvestMutation = useMutation({
    mutationFn: () => {
      if (!wasmClient || !novaAddress) {
        throw new Error("No wasm client or nova address given");
      }

      const novaVaultMsgComposers =
        new contracts.NovaVault.NovaVaultMessageComposer(
          novaAddress,
          pair.vaultContractAddress,
        );
      const vaultHarvestMsg = novaVaultMsgComposers.claim([]);
      return executeContractTx(vaultHarvestMsg, wasmClient, novaAddress);
    },
    onSuccess: (result) => {
      if (!result) {
        return;
      }

      refetchChainAssets();
      queryClient.invalidateQueries({
        queryKey: [
          "claimableAmount",
          `${pair.asset0.denom}/${pair.asset1.denom}`,
        ],
      });
    },
  });

  return harvestMutation;
};

export default useHarvestMutation;
