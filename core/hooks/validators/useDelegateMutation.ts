import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import executeNovaTx from "core/txs/executeNovaTx";
import { cosmos } from "supernovajs";

interface DelegateMutationProps {
  operatorAddress: string;
  amount: string;
  denom: string;
}

const useDelegateMutation = () => {
  const queryClient = useQueryClient();
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const delegateMutation = useMutation({
    mutationFn: ({ operatorAddress, amount, denom }: DelegateMutationProps) => {
      if (!novaClient || !novaAddress) {
        throw new Error("No novaClient or novaAddress exists");
      }

      const { delegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;
      const delegateMsg = delegate({
        delegatorAddress: novaAddress,
        validatorAddress: operatorAddress,
        amount: { amount: amount, denom: denom },
      });

      return executeNovaTx(delegateMsg, novaClient, novaAddress);
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
        queryKey: ["myValidators", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["delegations", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["rewards", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["bondedToken"],
      });
    },
  });
  return delegateMutation;
};

export default useDelegateMutation;
