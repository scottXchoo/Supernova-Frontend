import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import _ from "lodash";
import { coins } from "cosmwasm";
import {
  CONTRACT_GAS_AMOUNT,
  CONTRACT_GAS_FEE,
} from "core/constants/constants";
import executeTx from "./executeTx";

type MsgType = {
  typeUrl: string;
  value: object;
};

export const executeContractTx = async (
  msg: MsgType,
  client: SigningCosmWasmClient,
  address: string,
) => {
  return executeTx([msg], _.cloneDeep(client), address, {
    gas: CONTRACT_GAS_FEE,
    amount: coins(CONTRACT_GAS_AMOUNT, "unova"),
  });
};
