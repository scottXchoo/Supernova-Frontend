import React, { useEffect, useState } from "react";
import { getSlippageInPercent } from "core/state/swapState";
import { useRecoilValue } from "recoil";
import { InfoIcon } from "components/common/info";
import { usePriceImpact } from "core/hooks/usePriceImpact";
import { useEstimatedAmount } from "core/hooks/useEstimatedAmount";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
} from "core/utils/byDenomUtils";
import Big from "big.js";
import { SWAP_FEE } from "core/utils/constants";
import { usePoolRewardAprInfo } from "core/hooks/usePoolRewardAprInfo";

type swapOptionProps = {
  fromDisplayDenom: string;
  toDisplayDenom: string;
  amount: string;
};

// should show default exchangeRate even when input amount is 0
const DEFAULT_INPUT_AMOUNT = 1;

export const SwapOptions = ({
  fromDisplayDenom,
  toDisplayDenom,
  amount,
}: swapOptionProps) => {
  const [inputAmount, setInputAmount] = useState<Big>(
    Big(DEFAULT_INPUT_AMOUNT),
  );
  const [exchangeRate, setExchangeRate] = useState(Big(0));

  useEffect(() => {
    setInputAmount(
      Big(amount === "0" || amount == "" ? DEFAULT_INPUT_AMOUNT : amount),
    );
  }, [amount]);

  const slippageInPercent = useRecoilValue(getSlippageInPercent);
  const fromDenom = denomByDisplayDenom(fromDisplayDenom);
  const fromDecimal = decimalByDisplayDenom(fromDisplayDenom);
  const toDenom = denomByDisplayDenom(toDisplayDenom);
  const priceImpact = usePriceImpact(
    fromDenom,
    toDenom,
    exchangeRate.toFixed(18, Big.roundDown),
  );

  const { data: estimatedAmount } = useEstimatedAmount(
    fromDisplayDenom,
    toDisplayDenom,
    inputAmount.toFixed(fromDecimal, Big.roundDown),
  );

  useEffect(() => {
    setExchangeRate(
      Big(estimatedAmount || 0).div(
        inputAmount.eq(0) ? DEFAULT_INPUT_AMOUNT : inputAmount,
      ),
    );
  }, [estimatedAmount, inputAmount]);

  return (
    <div className="grid grid-cols-2 mt-6">
      <div className="flex items-center md:mb-0.5 mb-1.5">
        <p className="text-gray-700 text-left md:text-base text-xs mr-1 md:mr-3">
          Exchange rate
        </p>
        <InfoIcon
          content={`${fromDisplayDenom}/${toDisplayDenom} exchange rate is determined by Curve Finance's stable swap. However, from gamma-2, it will be determined by “staked swap”, an appropriate AMM that reflects the characteristics of snAsset.`}
        />
      </div>
      <p className="text-gray-700 text-right text-xs md:text-base md:mb-0.5 mb-1.5">
        1 {fromDisplayDenom} ≈ {exchangeRate.toFixed(6, Big.roundDown)}{" "}
        {toDisplayDenom}
      </p>
      <div className="flex items-center md:mb-0.5 mb-1.5">
        <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
          Slippage Tolerance
        </p>
        <InfoIcon content="The actual value may differ from the estimated value due to conditions after trading. If you want to change the tolerance slippage, click the gear button at the top and edit the slippage tolerance." />
      </div>
      <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
        {slippageInPercent.toFixed(1, Big.roundDown)} %
      </p>
      <div className="flex items-center md:mb-0.5 mb-1.5">
        <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
          Price Impact
        </p>
        <InfoIcon content="The difference between the market price and estimated price due to trade size." />
      </div>
      <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
        {amount === "0" || amount === "" ? "0.0 %" : `${priceImpact} %`}
      </p>
    </div>
  );
};

type liquidityOptionProps = {
  fromDisplayDenom: string;
  toDisplayDenom: string;
  poolRate: Big;
};

export const AddLiquidityOptions = ({
  fromDisplayDenom,
  toDisplayDenom,
  poolRate,
}: liquidityOptionProps) => {
  const { poolAPR, poolInfo } = usePoolRewardAprInfo(fromDisplayDenom);
  const negativeExponent = 6;

  return (
    <div className="grid grid-cols-2 mt-6">
      <div className="flex items-center md:mb-0.5 mb-1.5">
        <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
          Exchange rate
        </p>
        <InfoIcon
          content={`${fromDisplayDenom}/${toDisplayDenom} exchange rate is determined by Curve Finance's stable swap. However, from gamma-2, it will be determined by “staked swap”, an appropriate AMM that reflects the characteristics of snAsset.`}
        />
      </div>
      <p className="text-gray-700 text-right text-xs md:text-base md:mb-0.5 mb-1.5">
        1 {fromDisplayDenom} ≈ {Big(poolRate).toFixed(6, Big.roundDown)}
        {toDisplayDenom}
      </p>
      <div className="flex items-center md:mb-0.5 mb-1.5">
        <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
          LP reward APR
        </p>
        <InfoIcon content={poolInfo} />
      </div>
      <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
        {SWAP_FEE}% +{" "}
        {poolAPR.toFixed(negativeExponent, Big.roundDown).toString()}%
      </p>
    </div>
  );
};
