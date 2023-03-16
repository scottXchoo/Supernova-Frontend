import { QueryEstimateSnAssetRequest } from "supernovajs/types/codegen/nova/gal/v1/query";
import { LCDQueryClient } from "supernovajs/types/codegen/nova/gal/v1/query.lcd";

export type QueryEstimateSnAssetProps = {
  queryClient: LCDQueryClient;
  param: QueryEstimateSnAssetRequest;
};

export const queryEstimatedSnAsset = async ({
  queryClient,
  param,
}: QueryEstimateSnAssetProps) => {
  const estimatedAsset = (await queryClient.estimateSnAsset(param)).amount;
  return estimatedAsset;
};
