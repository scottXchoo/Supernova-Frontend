import Big from "big.js";
import { IBCAssetInfo } from "core/config/ibcAssets";
import {
  MAXIMUM_DECIMAL_POINT,
  SNTOKEN_DECIMAL_POINT,
} from "core/constants/constants";
import { getPairInfo } from "core/utils/byDenomUtils";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { getShareOfPoolRatio } from "core/utils/poolUtil";
import useEstimatedUSD from "../priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "../useExchangeRate";
import { useLpBalance, useLpDecimal, useTotalLpSupply } from "../useLiquidity";
import { usePooledAssetAmounts } from "../usePooledAssetAmounts";
import useStakedLpTokens from "./useStakedLpTokens";

const useTotalLpBalance = (ibcAssetInfo: IBCAssetInfo) => {
  const chainInfo = ibcAssetInfo;
  const zoneName = chainInfo?.counterpartyChainId || "";
  const denom = chainInfo?.coinCurrencies.coinMinimalDenom || "";
  const ibcDenom = makeIBCMinimalDenom(chainInfo?.sourceChannelId || "", denom);
  const snDenom = chainInfo?.snCurrencies.coinMinimalDenom || "";
  const decimal =
    chainInfo?.coinCurrencies.coinDecimals || MAXIMUM_DECIMAL_POINT;
  const snDecimal =
    chainInfo?.snCurrencies.coinDecimals || SNTOKEN_DECIMAL_POINT;

  const pair = getPairInfo(ibcDenom, snDenom);
  const { data: exchangeRate } = useExchangeRate(
    chainInfo?.coinCurrencies.coinDenom || "",
    chainInfo?.snCurrencies.coinDenom || "",
  );
  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    ibcDenom,
    snDenom,
    decimal,
    snDecimal,
  );

  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    pooledAssetAmount.toString() || "0",
    pooledSnAssetAmount.toString() || "0",
  );

  const lpDecimal = useLpDecimal(ibcDenom, snDenom);

  const lpTotalSupply = useTotalLpSupply(ibcDenom, snDenom);

  const displayLpTotalSupply = lpTotalSupply.div(Big(10).pow(lpDecimal));
  const lpBalance = useLpBalance(ibcDenom, snDenom);
  const { data: stakedLpTokens } = useStakedLpTokens(pair);
  const displayLpBalance = lpBalance
    .div(Big(10).pow(lpDecimal))
    .plus(Big(stakedLpTokens?.amount || "0").div(Big(10).pow(lpDecimal)));

  const shareOfPool = getShareOfPoolRatio(
    displayLpTotalSupply,
    displayLpBalance,
  );

  const poolLiquidityAmount = Big(estimatedAssetUSD).plus(estimatedSnAssetUSD);
  const myPoolBalance = convertBigToFixedString(
    poolLiquidityAmount.mul(shareOfPool),
    MAXIMUM_DECIMAL_POINT,
  );
  return myPoolBalance;
};
export default useTotalLpBalance;
