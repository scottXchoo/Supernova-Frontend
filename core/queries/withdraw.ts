import {
  QueryActiveWithdrawalsRequest,
  QueryPendingWithdrawalsRequest,
  QueryWithdrawRecordRequest,
} from "supernovajs/types/codegen/nova/gal/v1/query";
import { LCDQueryClient } from "supernovajs/types/codegen/nova/gal/v1/query.lcd";

export type queryWithdrawableProps = {
  queryClient: LCDQueryClient;
  param: QueryActiveWithdrawalsRequest;
};

export const queryWithdrawable = async ({
  queryClient,
  param,
}: queryWithdrawableProps) => {
  const withdrawable = (await queryClient.activeWithdrawals(param)).amount;
  return withdrawable;
};

export type QueryPendingWithdrawalsProps = {
  queryClient: LCDQueryClient;
  param: QueryPendingWithdrawalsRequest;
};

export const queryPendingWithdrawals = async ({
  queryClient,
  param,
}: QueryPendingWithdrawalsProps) => {
  const pendingWithdrawals = (await queryClient.pendingWithdrawals(param))
    .amount;
  return pendingWithdrawals;
};

export type QueryWithdrawRecordProps = {
  queryClient: LCDQueryClient;
  param: QueryWithdrawRecordRequest;
};

export const queryWithdrawRecord = async ({
  queryClient,
  param,
}: QueryWithdrawRecordProps) => {
  const withdrawRecords = await queryClient.withdrawRecords(param);
  return withdrawRecords.withdraw_record?.records;
};
