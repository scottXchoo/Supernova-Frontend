import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNovaAddress } from "core/state/coreState";
import { useRecoilValue, useSetRecoilState } from "recoil";
import _ from "lodash";
import { toast } from "react-toastify";
import { SigningStargateClient } from "@cosmjs/stargate";
import {
  isDepositModalOpenAtom,
  isWithdrawModalOpenAtom,
} from "core/state/assets/modal";
import traceIBCTransfer from "./traceIBCTransfer";

interface IBCWTransferMutationProps {
  client: SigningStargateClient;
  senderAddress: string;
  receipmentAddress: string;
  transferAmount: string;
  transferDenom: string;
  sourceChannel: string;
}

export const RESPONSE_SUCCESS_CODE = 0;
export const IBC_TRANSFER_PORT = "transfer";

const useIBCWithdrawMutation = (rpc: string) => {
  const queryClient = useQueryClient();
  const novaAddress = useRecoilValue(getNovaAddress);
  const setIsWithdrawModalOpen = useSetRecoilState(isWithdrawModalOpenAtom);
  const setIsDepositModalOpen = useSetRecoilState(isDepositModalOpenAtom);

  const IBCTransferMutation = useMutation({
    mutationFn: ({
      client,
      senderAddress,
      receipmentAddress,
      transferAmount,
      transferDenom,
      sourceChannel,
    }: IBCWTransferMutationProps) => {
      if (!client) {
        throw new Error("No novaClient or novaAddress exists");
      }
      const timeout = Math.floor(new Date().getTime() / 1000) + 600;
      const sendAmount = { amount: transferAmount, denom: transferDenom };
      return toast.promise(
        _.cloneDeep(client).sendIbcTokens(
          senderAddress,
          receipmentAddress,
          sendAmount,
          IBC_TRANSFER_PORT,
          sourceChannel,
          undefined,
          timeout,
          "auto",
        ),
        {
          pending: "Tx Broadcasting...",
        },
      );
    },
    onError(error: Error) {
      toast.error(error.message);
    },
    onSuccess: (result) => {
      if (result.code == RESPONSE_SUCCESS_CODE) {
        toast.success("Tx Success 👌");
        setIsWithdrawModalOpen(false);
        setIsDepositModalOpen(false);
        toast.promise(
          traceIBCTransfer(rpc, result, () =>
            queryClient.invalidateQueries({
              queryKey: ["allBalance", novaAddress],
            }),
          ),
          {
            pending: "Wait for IBC Transfer...",
            success: "IBC Transfer Complete",
            error: "IBC Transfer Failed",
          },
        );
      } else {
        toast.error(result.rawLog);
      }
    },
  });
  return IBCTransferMutation;
};

export default useIBCWithdrawMutation;
