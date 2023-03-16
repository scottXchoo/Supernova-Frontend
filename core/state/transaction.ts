/* eslint-disable no-unused-vars */
import { atom } from "recoil";
import { v1 } from "uuid";

export enum TransactionStatus {
  IDLE = "IDLE",
  EXECUTING = "EXECUTING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum TransactionType {
  STAKE = "STAKE",
  SWAP = "SWAP",
  ADDLIQUIDITY = "ADDLIQUIDITY",
  REMOVELIQUIDITY = "REMOVELIQUIDITY",
  SNCLAIM = "SNCLAIM",
  UNSTAKE = "UNSTAKE",
  CLAIM = "CLAIM",
  POOLS = "POOLS",
}
export type TypeTransactionStatus = {
  status: TransactionStatus;
  type: TransactionType;
};

export const transactionStatusAtom = atom<TypeTransactionStatus>({
  key: `stake/${v1()}`,
  default: {
    status: TransactionStatus.IDLE,
    type: TransactionType.STAKE,
  },
});
