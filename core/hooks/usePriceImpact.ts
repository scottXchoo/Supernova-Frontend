import { useEffect, useState } from "react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { PoolAsset } from "core/utils/Swap";
import { swapAtom } from "core/state/swapState";
import {
  decimalByDisplayDenom,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import { poolQuery } from "core/selectors/pair";
import Big from "big.js";

function currentRatio(amount0: Big, amount1: Big): Big {
  if (amount0.eq(Big(0))) {
    return Big(1);
  } else {
    const currentRate = amount1.div(amount0);
    return currentRate;
  }
}

function checkPriceImpact(exchangeRate: string, currentRatio: Big): string {
  if (currentRatio.eq(0)) {
    return "100";
  }

  const absMinusPriceImpact = Big(exchangeRate).minus(currentRatio).abs();
  const mulPriceImpact = absMinusPriceImpact.div(currentRatio).mul(100);
  if (mulPriceImpact.lte(0.001)) {
    return "-< 0.001";
  } else {
    return mulPriceImpact.toFixed(6, Big.roundDown);
  }
}

export const usePriceImpact = (
  denom0: string,
  denom1: string,
  exchangeRate: string,
) => {
  const [priceImpact, setPriceImpact] = useState<string>("0");
  const [fromToken, toToken] = useRecoilValue(swapAtom);
  const decimal0 = decimalByDisplayDenom(fromToken.denom);
  const decimal1 = decimalByDisplayDenom(toToken.denom);
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const poolAsset = useRecoilValueLoadable(poolQuery(pairAddress || ""));

  useEffect(() => {
    if (poolAsset.state === "hasValue") {
      if (poolAsset.contents == null) {
        return;
      }
      const poolAssets = new PoolAsset(poolAsset.contents.assets, denom0);

      if (
        poolAssets.asset[0].amount === "0" ||
        poolAssets.asset[1].amount === "0"
      ) {
        return; // div 0
      }

      const assetInfo0 = poolAssets.decideAssetType(poolAssets.asset[0].info);
      const assetInfo1 = poolAssets.decideAssetType(poolAssets.asset[1].info);
      if (assetInfo0 === denom0) {
        const currentRatio0 = currentRatio(
          Big(poolAssets.asset[0].amount).div(Big(10).pow(decimal0 || 0)),
          Big(poolAssets.asset[1].amount).div(Big(10).pow(decimal1 || 0)),
        );
        setPriceImpact(checkPriceImpact(exchangeRate, currentRatio0));
      } else if (assetInfo1 === denom0) {
        const currentRatio1 = currentRatio(
          Big(poolAssets.asset[1].amount).div(Big(10).pow(decimal0 || 0)),
          Big(poolAssets.asset[0].amount).div(Big(10).pow(decimal1 || 0)),
        );
        setPriceImpact(checkPriceImpact(exchangeRate, currentRatio1));
      }
    }
  }, [denom0, exchangeRate, poolAsset]);
  return priceImpact;
};
