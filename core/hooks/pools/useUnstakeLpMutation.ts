import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PairInfo } from "core/config/pairInfo";
import { getWasmClient, getNovaAddress } from "core/state/coreState";
import { executeContractTx } from "core/txs/executeContractTx";
import { useRecoilValue } from "recoil";
import { contracts } from "supernovajs-contracts";
import { useLiquidity } from "../useLiquidity";

interface unstakeLpMutationProps {
  amount: string;
}

const useUnstakeLpMutation = (pair?: PairInfo) => {
  const queryClient = useQueryClient();
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const pairKey = pair ? `${pair.asset0.denom}/${pair.asset1.denom}` : "";
  const { refetchLpBalance, refetchPooledAsset } = useLiquidity(
    pair?.lpTokenContractAddress || "",
    pair?.pairContractAddress || "",
  );

  const unstakeLpMutation = useMutation({
    mutationFn: async ({ amount }: unstakeLpMutationProps) => {
      if (!wasmClient || !novaAddress || !pair) {
        throw new Error("No wasm client, nova address or pair info given");
      }

      const novaVaultMsgComposers =
        new contracts.NovaVault.NovaVaultMessageComposer(
          novaAddress,
          pair.vaultContractAddress,
        );

      const vaultWithdrawMsg = novaVaultMsgComposers.withdraw({
        amount: amount,
      });
      return executeContractTx(vaultWithdrawMsg, wasmClient, novaAddress);
    },
    onSuccess: (result) => {
      if (!result) {
        return;
      }

      refetchLpBalance();
      refetchPooledAsset();
      queryClient.invalidateQueries({
        queryKey: [
          "stakedLpTokens",
          {
            address: novaAddress,
            pair: pairKey,
          },
        ],
      });
    },
  });

  return unstakeLpMutation;
};

export default useUnstakeLpMutation;
