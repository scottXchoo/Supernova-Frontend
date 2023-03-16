import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import executeNovaTx from "core/txs/executeNovaTx";
import { isVoteSuccessModalOpenAtom } from "core/state/proposal/vote/voteModal";

const VoteTypeUrl = "/cosmos.gov.v1beta1.MsgVote";
const useVoteMutation = (id: string) => {
  const queryClient = useQueryClient();
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const setIsSuccessVoteModalOpen = useSetRecoilState(
    isVoteSuccessModalOpenAtom,
  );

  const voteMutaion = useMutation({
    mutationFn: (option: VoteOption) => {
      if (!novaClient || !novaAddress) {
        throw new Error("No novaClient or novaAddress exists");
      }
      const voteMsg = {
        typeUrl: VoteTypeUrl,
        value: MsgVote.fromPartial({
          proposalId: id,
          voter: novaAddress,
          option: option,
        }),
      };

      return executeNovaTx(voteMsg, novaClient, novaAddress);
    },
    onSuccess: async (result) => {
      if (!result) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["fetchUserVote", { id, address: novaAddress }],
      });
      queryClient.invalidateQueries({
        queryKey: ["proposalTally", id],
      });
      setTimeout(() => {
        setIsSuccessVoteModalOpen(true);
      }, 500);
    },
  });
  return voteMutaion;
};

export default useVoteMutation;
