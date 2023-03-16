import Big from "big.js";
import { InfoIcon } from "components/common/info";
import { PairInfo } from "core/config/pairInfo";
import { usePooledAssetAmounts } from "core/hooks/usePooledAssetAmounts";
import { decimalByDisplayDenom } from "core/utils/byDenomUtils";
import { SWAP_FEE } from "core/constants/constants";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import React from "react";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import { usePoolRewardAprInfo } from "core/hooks/usePoolRewardAprInfo";

const negativeExponent = 6;

const PoolsInfo = ({ pair }: { pair: PairInfo }) => {
  const displayDenom = pair.asset0.denom;
  const denom = pair.denoms[0];
  const denomDecimal = decimalByDisplayDenom(displayDenom);

  const displayShadowDenom = pair.asset1.denom;
  const shadowDenom = pair.denoms[1];
  const shadowDenomDecimal = decimalByDisplayDenom(displayShadowDenom);

  const zoneName = zoneIdByDisplayDenomMap[displayDenom];
  const { poolAPR, poolInfo } = usePoolRewardAprInfo(displayDenom);

  // Pooled Asset
  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom,
    shadowDenom,
    denomDecimal,
    shadowDenomDecimal,
  );

  const { data: exchangeRate } = useExchangeRate(
    displayDenom,
    displayShadowDenom,
  );
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    pooledAssetAmount.toString() || "0",
    pooledSnAssetAmount.toString() || "0",
  );

  const poolLiquidityAmount = Big(estimatedAssetUSD).plus(estimatedSnAssetUSD);

  return (
    <div className="grid grid-cols-2 space-y-1 mb-3 md:px-2 px-1">
      <div className="flex items-center">
        <p className="text-black font-medium text-left md:text-xl text-sm mr-1 md:mr-2 xl:text-lg">
          Pool Liquidity
        </p>
        <InfoIcon content="Total value of the funds in this liquidity pool" />
      </div>
      <p className="text-black text-right md:text-xl text-sm xl:text-lg font-semibold">
        $ {convertBigToFixedString(poolLiquidityAmount, negativeExponent)}
      </p>
      <div className="flex items-center">
        <p className="text-black font-medium text-left md:text-xl text-sm mr-1 md:mr-2 xl:text-lg">
          APR
        </p>
        <InfoIcon content={poolInfo} />
      </div>
      <div className="text-black text-right md:text-xl text-sm xl:text-lg font-semibold">
        {SWAP_FEE}%{" "}
        <p className="inline-block text-purple-500 text-right md:text-xl text-sm xl:text-lg font-semibold">
          + {poolAPR.toFixed(negativeExponent, Big.roundDown).toString()}%
        </p>
      </div>
    </div>
  );
};

export default PoolsInfo;
