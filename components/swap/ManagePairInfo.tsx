import { usePooledAssetAmounts } from "core/hooks/usePooledAssetAmounts";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
} from "core/utils/byDenomUtils";
import { useState } from "react";
import { useRouter } from "next/router";
import { NovaArrow } from "components/common/novaArrow";
import {
  useLpBalance,
  useLpDecimal,
  useTotalLpSupply,
} from "core/hooks/useLiquidity";
import clsx from "clsx";
import * as gtag from "lib/gtag";
import Big from "big.js";
import { PairInfo } from "core/config/pairInfo";
import useStakedLpTokens from "core/hooks/pools/useStakedLpTokens";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { SWAP_FEE } from "core/utils/constants";
import { usePoolRewardAprInfo } from "core/hooks/usePoolRewardAprInfo";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import {
  convertPoolShareToDisplayPercentage,
  getShareOfPoolRatio,
} from "core/utils/poolUtil";

type ManagePairInfoProps = {
  pair: PairInfo;
  displayDenom0: string;
  img0: string;
  displayDenom1: string;
  img1: string;
};

const negativeExponent = 6;

export const ManagePairInfo = ({
  pair,
  displayDenom0,
  img0,
  displayDenom1,
  img1,
}: ManagePairInfoProps) => {
  const [dropDown, setDropDown] = useState(false);
  const router = useRouter();
  const denom = denomByDisplayDenom(displayDenom0);
  const denomDecimal = decimalByDisplayDenom(displayDenom0);

  const shadowDenom = denomByDisplayDenom(displayDenom1);
  const shadowDenomDecimal = decimalByDisplayDenom(displayDenom1);

  const lpDecimal = useLpDecimal(denom, shadowDenom);
  const { poolAPR } = usePoolRewardAprInfo(displayDenom0);

  // Pooled Asset
  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom,
    shadowDenom,
    denomDecimal,
    shadowDenomDecimal,
  );

  const zoneName = zoneIdByDisplayDenomMap[displayDenom0];
  const { data: exchangeRate } = useExchangeRate(displayDenom0, displayDenom1);
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    pooledAssetAmount.toString() || "0",
    pooledSnAssetAmount.toString() || "0",
  );

  // Total LP tokens
  const lpTotalSupply = useTotalLpSupply(denom, shadowDenom);
  const displayLpTotalSupply = lpTotalSupply.div(Big(10).pow(lpDecimal));

  // My LP tokens
  const { data: stakedLpTokens } = useStakedLpTokens(pair);
  const lpBalance = useLpBalance(denom, shadowDenom);
  const displayLpBalance = lpBalance
    .div(Big(10).pow(lpDecimal))
    .plus(Big(stakedLpTokens?.amount || "0").div(Big(10).pow(lpDecimal)));

  // Share of pool
  const shareOfPool = getShareOfPoolRatio(
    displayLpTotalSupply,
    displayLpBalance,
  );

  // My Pooled  Amount
  const myPooledAssetAmount = convertBigToFixedString(
    pooledAssetAmount.mul(shareOfPool),
    negativeExponent,
  );

  const myPooledSnAssetAmount = convertBigToFixedString(
    pooledSnAssetAmount.mul(shareOfPool),
    negativeExponent,
  );

  const poolLiquidityAmount = Big(estimatedAssetUSD).plus(estimatedSnAssetUSD);

  const myPoolBalance = convertBigToFixedString(
    poolLiquidityAmount.mul(shareOfPool),
    negativeExponent,
  );

  // Button Add or Remove
  const clickLiquidityState = (
    e: React.MouseEvent<HTMLButtonElement>,
    link: string,
  ) => {
    e.preventDefault();
    router.push(link);
    gtag.event({
      action: "click-manage-liquidity",
      category: "liquidity",
    });
  };

  const hasNoShare =
    lpBalance.eq(0) && Big(stakedLpTokens?.amount || "0").eq(0);

  const dropDownHandler = () => {
    setDropDown(!dropDown);
  };

  return (
    <div className="relative lnline-block shadow-sm  bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 p-0.5 md:rounded-xl rounded-lg md:mb-4 mb-2 md:mt-2 mt-1">
      <button
        onClick={dropDownHandler}
        className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 md:rounded-xl rounded-lg md:px-6 md:py-5 py-3 px-3"
      >
        <div className="flex-initial col-span-4 ">
          <div className="flex items-center">
            <img
              className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full mr-0.5"
              src={img0}
              alt="atom"
            />
            <img
              className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full md:mr-2 mr-1"
              src={img1}
              alt="snAtom"
            />
            <h3
              className={clsx("md:text-2xl text-base text-left font-semibold", {
                "text-gray-700": hasNoShare,
                "text-black": !hasNoShare,
              })}
            >
              {displayDenom0}/{displayDenom1}
            </h3>
          </div>
        </div>
        <div className="flex items-center col-span-3 justify-end">
          <p className="md:text-lg text-xs text-gray-700 font-medium">Manage</p>
          <NovaArrow isRotateTop={dropDown} />
        </div>
      </button>
      {dropDown && (
        <div className="relative block -mt-1.5">
          <div className="block static -top-2 bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 w-full h-0.5 "></div>
          <div className="bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 w-full md:rounded-b-xl rounded-b-lg md:px-5 md:py-4 py-3 px-3">
            <div className="grid grid-cols-2 space-y-1 mb-3">
              <div className="flex items-center">
                <p className="text-black font-semibold text-left md:text-base text-xs truncate mr-1 md:mr-3">
                  Pool liquidity
                </p>
              </div>
              <p className="text-black font-medium text-right md:text-base text-xs truncate">
                ${" "}
                {convertBigToFixedString(poolLiquidityAmount, negativeExponent)}
              </p>
              <div className="flex items-center">
                <p className="text-black font-semibold text-left md:text-base text-xs truncate mr-1 md:mr-3">
                  My pool balance
                </p>
              </div>
              <p className="text-black font-medium text-right md:text-base text-xs truncate">
                $ {myPoolBalance}
              </p>
              <div className="pt-1 flex items-center">
                <img
                  className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                  src={img0}
                  alt=""
                />
                <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                  Pooled {displayDenom0}
                </p>
              </div>
              <p className="pt-1 text-black font-medium text-right md:text-sm text-xs truncate">
                {myPooledAssetAmount}
              </p>
              <div className="pb-1 flex items-center">
                <img
                  className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                  src={img1}
                  alt=""
                />
                <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                  Pooled {displayDenom1}
                </p>
              </div>
              <p className="pb-1 text-black font-medium text-right md:text-sm text-xs truncate">
                {myPooledSnAssetAmount}
              </p>
              <div className="flex items-center">
                <p className="text-black font-semibold text-left md:text-base text-xs truncate">
                  Share of pool
                </p>
              </div>
              <p className="text-black font-medium text-right md:text-base text-xs truncate">
                {convertPoolShareToDisplayPercentage(
                  shareOfPool,
                  negativeExponent,
                )}
                %
              </p>
              <div className="flex items-center">
                <p className="text-black font-semibold text-left md:text-base text-xs truncate">
                  LP reward APR
                </p>
              </div>
              <p className="text-black font-medium text-right md:text-base text-xs truncate">
                {SWAP_FEE}% +{" "}
                {poolAPR.toFixed(negativeExponent, Big.roundDown).toString()}%
              </p>
            </div>
            <button
              className="inline-block w-full md:mt-3 mt-2 md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-yellow-500 bg-black hover:bg-gray-800 font-semibold transform duration-200 shadow-sm text-lg"
              onClick={(e) =>
                clickLiquidityState(
                  e,
                  `liquidity/add/${displayDenom0}?snDenom=${displayDenom1}`,
                )
              }
            >
              Add liquidity
            </button>
            <button
              disabled={hasNoShare}
              className={clsx(
                "inline-block w-full md:mt-2 mt-1 md:py-3 py-2 px-4 md:mb-3 mb-2 text-center md:text-2xl md:rounded-xl rounded-lg font-semibold transform duration-200 shadow-sm text-lg",
                !hasNoShare
                  ? "text-purple-500 bg-black hover:bg-gray-800"
                  : "text-gray-700 bg-gray-400 cursor-not-allowed",
              )}
              onClick={(e) =>
                clickLiquidityState(
                  e,
                  `liquidity/remove/${displayDenom0}?snDenom=${displayDenom1}`,
                )
              }
            >
              Remove liquidity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
