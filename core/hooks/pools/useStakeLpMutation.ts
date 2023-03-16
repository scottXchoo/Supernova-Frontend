import { executeContractTx } from "core/txs/executeContractTx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress, getWasmClient } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import { contracts } from "supernovajs-contracts";
import { PairInfo } from "core/config/pairInfo";
import { useLiquidity } from "../useLiquidity";

interface stakeLpMutationProps {
  lpTokenAddress: string;
  amount: string;
}

const useStakeLpMutation = (pair?: PairInfo) => {
  const queryClient = useQueryClient();
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const pairKey = pair ? `${pair.asset0.denom}/${pair.asset1.denom}` : "";
  const { refetchLpBalance, refetchPooledAsset } = useLiquidity(
    pair?.lpTokenContractAddress || "",
    pair?.pairContractAddress || "",
  );

  const stakeLpMutation = useMutation({
    mutationFn: ({ lpTokenAddress, amount }: stakeLpMutationProps) => {
      if (!wasmClient || !novaAddress || !pair) {
        throw new Error("No wasm client, nova address or pair info given");
      }

      const tokenMsgComposers = new contracts.Token.TokenMessageComposer(
        novaAddress,
        lpTokenAddress,
      );
      const depositMsg = {
        deposit: {},
      };
      const sendMsg = tokenMsgComposers.send({
        amount,
        contract: pair.vaultContractAddress,
        msg: Buffer.from(JSON.stringify(depositMsg)).toString("base64"),
      });

      return executeContractTx(sendMsg, wasmClient, novaAddress);
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

  return stakeLpMutation;
};

export default useStakeLpMutation;
