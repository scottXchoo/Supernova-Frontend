import Big from "big.js";
import { PairInfo } from "core/config/pairInfo";
import { usePooledAssetAmounts } from "core/hooks/usePooledAssetAmounts";
import { decimalByDisplayDenom } from "core/utils/byDenomUtils";

const usePoolRatio = (pair: PairInfo) => {
  const [denom, shadowDenom] = pair.denoms;
  const denomDecimal = decimalByDisplayDenom(denom);
  const shadowDenomDecimal = decimalByDisplayDenom(shadowDenom);

  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom,
    shadowDenom,
    denomDecimal,
    shadowDenomDecimal,
  );

  const isPoolEmpty = pooledAssetAmount.eq(0) || pooledSnAssetAmount.eq(0);
  if (isPoolEmpty) {
    return Big(1);
  }

  return pooledSnAssetAmount.div(pooledAssetAmount);
};

export default usePoolRatio;
