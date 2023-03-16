import { DeliverTxResponse, SigningStargateClient } from "@cosmjs/stargate";
import {
  MsgClaimSnAsset,
  MsgDeposit,
  MsgPendingUndelegate,
  MsgUndelegate,
  MsgWithdraw,
} from "supernovajs/types/codegen/nova/gal/v1/tx";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import {
  MsgBeginRedelegate,
  MsgDelegate,
} from "supernovajs/types/codegen/cosmos/staking/v1beta1/tx";
import _ from "lodash";
import { TX_GAS_FEE } from "core/constants/constants";
import { MsgWithdrawDelegatorReward } from "supernovajs/types/codegen/cosmos/distribution/v1beta1/tx";
import executeTx from "./executeTx";

//execute nova txs

type MsgType = {
  typeUrl: string;
  value:
    | MsgDeposit
    | MsgWithdraw
    | MsgClaimSnAsset
    | MsgVote
    | MsgDelegate
    | MsgBeginRedelegate
    | MsgPendingUndelegate
    | MsgUndelegate
    | MsgWithdrawDelegatorReward;
};

const defaultFee = {
  amount: [
    {
      amount: String(0),
      denom: "unova",
    },
  ],
  gas: String(TX_GAS_FEE),
};

const executeNovaTx = async (
  msg: MsgType | MsgType[],
  client: SigningStargateClient,
  address: string,
): Promise<DeliverTxResponse | null> => {
  const msgArray = Array.isArray(msg) ? msg : [msg];
  return executeTx(msgArray, _.cloneDeep(client), address, defaultFee);
};

export default executeNovaTx;
