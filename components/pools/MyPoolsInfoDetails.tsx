import Big from "big.js";
import { NovaArrow } from "components/common/novaArrow";
import { PairInfo } from "core/config/pairInfo";
import useStakedLpTokens from "core/hooks/pools/useStakedLpTokens";
import {
  useLpBalance,
  useLpDecimal,
  useTotalLpSupply,
} from "core/hooks/useLiquidity";
import { usePooledAssetAmounts } from "core/hooks/usePooledAssetAmounts";
import {
  convertPoolShareToDisplayPercentage,
  getShareOfPoolRatio,
} from "core/utils/poolUtil";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
} from "core/utils/byDenomUtils";
import React, { useState } from "react";
import { convertBigToFixedString } from "core/utils/numberFormatter";

const negativeExponent = 6;

const MyPoolsInfoDetails = ({ pair }: { pair: PairInfo }) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const dropDownHandler = () => {
    setOpenDropdown(!openDropdown);
  };

  const displayDenom = pair.asset0.denom;
  const denomImage = pair.asset0.img;
  const denom = denomByDisplayDenom(displayDenom);
  const denomDecimal = decimalByDisplayDenom(displayDenom);

  const displayShadowDenom = pair.asset1.denom;
  const shadowDenomImage = pair.asset1.img;
  const shadowDenom = denomByDisplayDenom(displayShadowDenom);
  const shadowDenomDecimal = decimalByDisplayDenom(displayShadowDenom);

  const lpDecimal = useLpDecimal(denom, shadowDenom);

  // Total LP tokens
  const lpTotalSupply = useTotalLpSupply(denom, shadowDenom);
  const displayLpTotalSupply = lpTotalSupply.div(Big(10).pow(lpDecimal));

  // My staked LP balance
  const { data: stakedLpBalance } = useStakedLpTokens(pair);
  const stakedLpDisplayBalance = Big(stakedLpBalance?.amount || "0").div(
    Big(10).pow(lpDecimal),
  );

  // My unstaked LP balance
  const unstakedLpBalance = useLpBalance(denom, shadowDenom);
  const unstakedLpDisplayBalance = unstakedLpBalance.div(
    Big(10).pow(lpDecimal),
  );

  // Pooled asset amounts
  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom,
    shadowDenom,
    denomDecimal,
    shadowDenomDecimal,
  );

  // Share of pool
  const stakedLpShareOfPool = getShareOfPoolRatio(
    displayLpTotalSupply,
    stakedLpDisplayBalance,
  );
  const unstakedLpShareOfPool = getShareOfPoolRatio(
    displayLpTotalSupply,
    unstakedLpDisplayBalance,
  );
  const shareOfPool = stakedLpShareOfPool.plus(unstakedLpShareOfPool);

  // My staked pooled amount
  const myPooledStakedAssetAmount = convertBigToFixedString(
    pooledAssetAmount.mul(stakedLpShareOfPool),
    negativeExponent,
  );
  const myPooledStakedSnAssetAmount = convertBigToFixedString(
    pooledSnAssetAmount.mul(stakedLpShareOfPool),
    negativeExponent,
  );

  // My available pooled amount
  const myPooledAvailableAssetAmount = convertBigToFixedString(
    pooledAssetAmount.mul(unstakedLpShareOfPool),
    negativeExponent,
  );
  const myPooledAvailableSnAssetAmount = convertBigToFixedString(
    pooledSnAssetAmount.mul(unstakedLpShareOfPool),
    negativeExponent,
  );

  return (
    <div className="relative block -mt-1.5">
      <div className="block static -top-2 bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 w-full h-0.5 "></div>
      <div className="bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 w-full md:rounded-b-xl rounded-b-lg md:px-5 md:py-2 py-1.5 px-3">
        <button
          onClick={dropDownHandler}
          className="flex items-center w-full justify-end"
        >
          {openDropdown ? (
            <p className="md:text-xl text-sm text-purple-500 font-semibold xl:text-lg">
              Hide
            </p>
          ) : (
            <p className="md:text-xl text-sm text-gray-700 font-semibold xl:text-lg">
              Details
            </p>
          )}
          <NovaArrow isRotateTop={openDropdown} />
        </button>
      </div>
      {openDropdown && (
        <div className="w-full bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 md:rounded-b-xl rounded-b-lg md:px-5 px-3 -mt-1.5 md:py-2 py-2">
          <div className="grid grid-cols-2 space-y-1 md:mb-3 mb-0">
            <div className="flex items-center">
              <p className="text-black font-semibold text-left md:text-base text-xs truncate mr-1 md:mr-3">
                Total LP tokens
              </p>
            </div>
            <p className="text-black font-medium text-right md:text-base text-xs truncate">
              {displayLpTotalSupply.toFixed(6, Big.roundDown)}
            </p>
            <div className="pt-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={denomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayDenom}
              </p>
            </div>
            <p className="pt-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {pooledAssetAmount?.toFixed(6, Big.roundDown) || "0.000000"}
            </p>
            <div className="pb-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={shadowDenomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayShadowDenom}
              </p>
            </div>
            <p className="pb-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {pooledSnAssetAmount?.toFixed(6, Big.roundDown) || "0.000000"}
            </p>

            {/* My staked LP tokens */}
            <div className="flex items-center">
              <p className="text-black font-semibold text-left md:text-base text-xs truncate mr-1 md:mr-3">
                My staked LP tokens
              </p>
            </div>
            <p className="text-black font-medium text-right md:text-base text-xs truncate">
              {convertBigToFixedString(
                stakedLpDisplayBalance,
                negativeExponent,
              )}
            </p>
            <div className="pt-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={denomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayDenom}
              </p>
            </div>
            <p className="pt-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {myPooledStakedAssetAmount}
            </p>
            <div className="pb-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={shadowDenomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayShadowDenom}
              </p>
            </div>
            <p className="pb-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {myPooledStakedSnAssetAmount}
            </p>

            {/* My unstaked LP tokens */}
            <div className="flex items-center">
              <p className="text-black font-semibold text-left md:text-base text-xs truncate mr-1 md:mr-3">
                My unstaked LP tokens
              </p>
            </div>
            <p className="text-black font-medium text-right md:text-base text-xs truncate">
              {convertBigToFixedString(
                unstakedLpDisplayBalance,
                negativeExponent,
              )}
            </p>
            <div className="pt-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={denomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayDenom}
              </p>
            </div>
            <p className="pt-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {myPooledAvailableAssetAmount}
            </p>
            <div className="pb-1 flex items-center">
              <img
                className="md:w-[1rem] md:h-[1rem] w-3 h-3 bg-gray-300 rounded-full mr-1"
                src={shadowDenomImage}
                alt=""
              />
              <p className="text-black font-medium text-left md:text-sm text-xs truncate">
                Pooled {displayShadowDenom}
              </p>
            </div>
            <p className="pb-1 text-black font-medium text-right md:text-sm text-xs truncate">
              {myPooledAvailableSnAssetAmount}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPoolsInfoDetails;
