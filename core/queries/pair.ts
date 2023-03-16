import { PairQueryClient } from "supernovajs-contracts/types/codegen/Pair.client";
import { assetWithAmountFromDenom } from "core/utils/byDenomUtils";

export type QuerySimulationProps = {
  queryClient: PairQueryClient;
  selectedDenom: string;
  inputAmount: string;
};

export const queryReturnAmount = async ({
  queryClient,
  selectedDenom,
  inputAmount,
}: QuerySimulationProps) => {
  const offerAsset =
    assetWithAmountFromDenom(selectedDenom)?.assetInfoWithAmount(inputAmount);
  if (offerAsset === undefined) {
    return;
  }

  const returnAmount = await queryClient.simulation({
    offerAsset,
  });
  return returnAmount.return_amount;
};

export type QueryProps = {
  queryClient: PairQueryClient;
};

export const queryPool = async ({ queryClient }: QueryProps) => {
  const pool = await queryClient.pool();
  return pool;
};
export const queryPair = async ({ queryClient }: QueryProps) => {
  const pair = await queryClient.pair();
  return pair;
};
