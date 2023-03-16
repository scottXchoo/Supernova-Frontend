import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import executeNovaTx from "core/txs/executeNovaTx";
import { cosmos } from "supernovajs";

interface RedelegateMutationProps {
  validatorFromAddress: string;
  validatorToAddress: string;
  amount: string;
  denom: string;
}

const useRedelegateMutation = () => {
  const queryClient = useQueryClient();
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const redelegateMutation = useMutation({
    mutationFn: ({
      validatorFromAddress,
      validatorToAddress,
      amount,
      denom,
    }: RedelegateMutationProps) => {
      if (!novaClient || !novaAddress) {
        throw new Error("No novaClient or novaAddress exists");
      }

      const { beginRedelegate } =
        cosmos.staking.v1beta1.MessageComposer.withTypeUrl;
      const beginRedelegateMsg = beginRedelegate({
        delegatorAddress: novaAddress,
        validatorSrcAddress: validatorFromAddress,
        validatorDstAddress: validatorToAddress,
        amount: { denom: denom, amount: amount },
      });

      return executeNovaTx(beginRedelegateMsg, novaClient, novaAddress);
    },
    onSuccess: async (result) => {
      if (!result) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["novaBalance", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["validators"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bondedToken"],
      });
      queryClient.invalidateQueries({
        queryKey: ["rewards", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["myValidators", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["delegations", novaAddress],
      });
    },
  });
  return redelegateMutation;
};

export default useRedelegateMutation;
