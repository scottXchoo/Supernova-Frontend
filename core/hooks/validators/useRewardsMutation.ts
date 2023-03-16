import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import executeNovaTx from "core/txs/executeNovaTx";
import { cosmos } from "supernovajs";
import { RewardInfo } from "core/queries/validators/fetchRewards";

interface RewardsMutationProps {
  rewards: RewardInfo[];
}

const useRewardsMutation = () => {
  const queryClient = useQueryClient();
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);

  const rewardsMutation = useMutation({
    mutationFn: ({ rewards }: RewardsMutationProps) => {
      if (!novaClient || !novaAddress) {
        throw new Error("No novaClient or novaAddress exists");
      }

      const { withdrawDelegatorReward } =
        cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

      const withdrawDelegatorRewardMsgArray = rewards.map(
        (reward: RewardInfo) => {
          return withdrawDelegatorReward({
            delegatorAddress: novaAddress,
            validatorAddress: reward.validatorAddress,
          });
        },
      );
      return executeNovaTx(
        withdrawDelegatorRewardMsgArray,
        novaClient,
        novaAddress,
      );
    },
    onSuccess: async (result) => {
      if (!result) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["novaBalance", novaAddress],
      });
      queryClient.invalidateQueries({
        queryKey: ["rewards", novaAddress],
      });
    },
  });
  return rewardsMutation;
};

export default useRewardsMutation;
