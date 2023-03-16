import {
  QueryClaimableAmountRequest,
  QueryDepositRecordRequest,
} from "supernovajs/types/codegen/nova/gal/v1/query";
import { LCDQueryClient } from "supernovajs/types/codegen/nova/gal/v1/query.lcd";

export type QueryClaimableAssetsProps = {
  queryClient: LCDQueryClient;
  param: QueryClaimableAmountRequest;
};

export const queryClaimableAssets = async ({
  queryClient,
  param,
}: QueryClaimableAssetsProps) => {
  const claimable = (await queryClient.claimableAmount(param)).amount;
  return claimable;
};

export type QueryPendingDepositAssetsProps = {
  queryClient: LCDQueryClient;
  param: QueryDepositRecordRequest;
};

export const queryPendingDepositAssets = async ({
  queryClient,
  param,
}: QueryPendingDepositAssetsProps) => {
  const pendingDeposit = (await queryClient.depositAmount(param)).amount;
  return pendingDeposit;
};
