import { IBCAssetInfo } from "core/config/ibcAssets";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { estimateSnAssetQuery } from "core/selectors/estimate";
import Big from "big.js";

export const useEstimateSnAsset = (chainInfo: IBCAssetInfo) => {
  const estimatedValue = useRecoilValueLoadable(
    estimateSnAssetQuery(chainInfo.coinCurrencies.coinMinimalDenom),
  );
  const [estimatedRatio, setEstimatedRatio] = useState<Big>(Big(1));
  useEffect(() => {
    //TODO: maybe we have to use React Query...
    if (estimatedValue.state === "hasValue") {
      if (
        estimatedValue.contents !== null &&
        chainInfo?.snCurrencies.coinDecimals
      ) {
        const decimalNum = new Big(10).pow(
          chainInfo?.snCurrencies.coinDecimals,
        );
        const estimated = new Big(estimatedValue.contents.amount);
        setEstimatedRatio(estimated.div(decimalNum));
      }
    } else if (estimatedValue.state === "hasError") {
      setEstimatedRatio(Big(1));
    }
  }, [estimatedValue, chainInfo]);
  return { estimatedRatio };
};
