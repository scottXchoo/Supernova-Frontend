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

const useUndelegateMutation = () => {
  const queryClient = useQueryClient();
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);

  const undelegateMutation = useMutation({
    mutationFn: ({ operatorAddress, amount, denom }: DelegateMutationProps) => {
      if (!novaClient || !novaAddress) {
        throw new Error("No novaClient or novaAddress exists");
      }

      const { undelegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;
      const undelegateMsg = undelegate({
        delegatorAddress: novaAddress,
        validatorAddress: operatorAddress,
        amount: { amount: amount, denom: denom },
      });

      return executeNovaTx(undelegateMsg, novaClient, novaAddress);
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
        queryKey: ["myValidators", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["rewards", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["delegations", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["unbondingRecords", novaAddress],
      });
    },
  });
  return undelegateMutation;
};

export default useUndelegateMutation;
