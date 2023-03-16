import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { AssetWithAmount } from "./../utils/Asset";
import { contracts } from "supernovajs-contracts";
import { getSlippageInPercent } from "../state/swapState";
import { getNovaAddress, getWasmClient } from "core/state/coreState";
import { executeContractTx } from "core/txs/executeContractTx";
import {
  denomByDisplayDenom,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import Big from "big.js";
import { ParseDecimal } from "core/utils/numberFormatter";

export const useSwap = () => {
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const slippageInPercent = useRecoilValue(getSlippageInPercent);

  const executeSwap = useCallback(
    async (
      assetInfo: AssetWithAmount | undefined,
      fromDenom: string,
      toDenom: string,
      inputAmount: string,
    ) => {
      if (assetInfo == null) {
        return;
      }
      const contractAddress = pairAddressByDenoms(
        denomByDisplayDenom(fromDenom),
        denomByDisplayDenom(toDenom),
      );

      const decimal = assetInfo?.assetComponent.decimal || 0;
      const amount = Big(inputAmount || 0).toFixed(decimal, Big.roundDown);
      const decimalMulAmount = ParseDecimal(amount, decimal);

      if (!wasmClient || !novaAddress || !contractAddress) {
        throw new Error("No wasm client, nova address or pair info given");
      }

      const pairMsgComposers = new contracts.Pair.PairMessageComposer(
        novaAddress,
        contractAddress,
      );

      /** compose swap msg */
      const pairMsg = pairMsgComposers.swap(
        {
          maxSpread: slippageInPercent.div(100).toString(),
          offerAsset: assetInfo.assetInfoWithAmount(decimalMulAmount),
          to: novaAddress,
        },
        [assetInfo.getCoinInfo(decimalMulAmount)],
      );
      return executeContractTx(pairMsg, wasmClient, novaAddress);
    },
    [novaAddress, slippageInPercent, wasmClient],
  );

  return {
    executeSwap,
  };
};
