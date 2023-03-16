import Big from "big.js";
import { convertBigToFixedString } from "./numberFormatter";

export const MINIMUM_POOL_SHARE_RATIO = 0.00001;
export const MINIMUM_POOL_SHARE_RATIO_STRING = "-< 0.001";

export const convertPoolShareToDisplayPercentage = (
  shareOfPool: Big,
  negativeExponent: number,
): string => {
  const isDisplayMinimumPoolShareString =
    shareOfPool.gt(0) && shareOfPool.lte(MINIMUM_POOL_SHARE_RATIO);
  return isDisplayMinimumPoolShareString
    ? MINIMUM_POOL_SHARE_RATIO_STRING
    : convertBigToFixedString(shareOfPool.mul(100), negativeExponent);
};

export const getShareOfPoolRatio = (
  displayLpTotalSupply: Big,
  displayLpBalance: Big,
): Big => {
  if (displayLpBalance.eq(0) || displayLpTotalSupply.eq(0)) return Big(0);
  const lpPoolShare = displayLpBalance.div(displayLpTotalSupply);
  return lpPoolShare;
};
