import { useRecoilValue } from "recoil";
import {
  assetWithAmountFromDenom,
  decimalByDisplayDenom,
  denomByDisplayDenom,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import Big from "big.js";
import { useQuery } from "@tanstack/react-query";
import { getWasmClient } from "core/state/coreState";
import { useMemo } from "react";
import { contracts } from "supernovajs-contracts";

export const useEstimatedAmount = (
  fromDenom: string,
  toDenom: string,
  inputAmount: string,
) => {
  const wasmClient = useRecoilValue(getWasmClient);
  const fromDenomDecimal = decimalByDisplayDenom(fromDenom) || 0;
  const toDenomDecimal = decimalByDisplayDenom(toDenom) || 0;

  const inputAmountToBig = new Big(inputAmount || "0");
  const inputMulDecimal = inputAmountToBig.mul(Math.pow(10, fromDenomDecimal));
  const pairAddress = pairAddressByDenoms(
    denomByDisplayDenom(fromDenom),
    denomByDisplayDenom(toDenom),
  );

  const assetWithAmount = assetWithAmountFromDenom(fromDenom);

  const fetchExchangeRate = useMemo(() => {
    if (!wasmClient || !pairAddress || !assetWithAmount) {
      return null;
    }

    return async function fetchExchangeRate() {
      const queryClient = new contracts.Pair.PairQueryClient(
        wasmClient,
        pairAddress,
      );

      const offerAsset = assetWithAmount.assetInfoWithAmount(
        inputMulDecimal.toFixed(fromDenomDecimal, Big.roundDown),
      );

      const { return_amount: returnAmount } = await queryClient.simulation({
        offerAsset,
      });

      if (!returnAmount) {
        throw new Error("Failed to fetch exchange rate");
      }

      const returnAmountDivDecimal = new Big(returnAmount).div(
        Big(10).pow(toDenomDecimal),
      );

      return returnAmountDivDecimal.toFixed(toDenomDecimal, Big.roundDown);
    };
  }, [
    assetWithAmount,
    fromDenomDecimal,
    toDenomDecimal,
    inputMulDecimal,
    pairAddress,
    wasmClient,
  ]);

  const {
    data: exchangeRate,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["exchangeRate", { fromDenom, toDenom, amount: inputAmount }],
    queryFn: () => fetchExchangeRate?.(),
    enabled: !!fetchExchangeRate,
  });

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }

  return {
    data: exchangeRate,
    isLoading: false,
    error: null,
  };
};
