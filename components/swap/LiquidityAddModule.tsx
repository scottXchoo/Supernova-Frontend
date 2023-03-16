import React, { useEffect, useState } from "react";
import { LiquidityAddBtn } from "components/icons/SwapIcon";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { useWallet } from "core/hooks/useWallet";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import { AddLiquidityOptions } from "./components/Options";
import { useLiquidity } from "../../core/hooks/useLiquidity";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
  displayBalanceByDenom,
  getPairInfo,
} from "core/utils/byDenomUtils";
import { useChainAssets } from "core/hooks/useAssets";
import { defaultChainInfo } from "core/config/chainInfo";
import { MsgComposer } from "core/utils/Swap";
import * as gtag from "lib/gtag";
import Big from "big.js";
import clsx from "clsx";
import { pairInfo } from "core/config/pairInfo";
import Button from "components/common/Button";
import usePoolRatio from "core/hooks/pools/usePoolRatio";
import UpperAssetInput, {
  upperAssetInputAtom,
} from "components/liquidity/add/UpperAssetInput";
import useInput from "core/hooks/useInput";
import {
  convertBigToFixedString,
  ParseDecimal,
} from "core/utils/numberFormatter";
import {
  isLowerAssetInsufficientBalanceAtom,
  isUpperAssetInsufficientBalanceAtom,
} from "core/state/liquidity";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";

export type AssetInfo = {
  availableAmount: string;
  decimal: number;
};

export const lowerAssetInputAtom = atom({
  key: "lowerAssetInput",
  default: "",
});

export enum PairPart {
  Upper = "upper",
  Lower = "lower",
}
export const changedPairPartAtom = atom<PairPart>({
  key: "changedPairPart",
  default: PairPart.Upper,
});

type LiquidityAddType = {
  denom: string;
  snDenom: string;
};

export const LiquidityAddModule = ({ denom, snDenom }: LiquidityAddType) => {
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);
  const { enabled } = useWallet();

  const [pair, setPair] = useState(pairInfo[0]);
  const [fromAssetInput, setFromAssetInput] =
    useRecoilState(upperAssetInputAtom);
  const [toAssetInput, setToAssetInput] = useRecoilState(lowerAssetInputAtom);

  const [upperAssetInfo, setUpperAssetInfo] = useState<AssetInfo>({
    availableAmount: "0",
    decimal: 0,
  });
  const [toAssetInfo, setToAssetInfo] = useState<AssetInfo>({
    availableAmount: "0",
    decimal: 0,
  });

  const isUpperAssetInsufficientBalance = useRecoilValue(
    isUpperAssetInsufficientBalanceAtom,
  );
  const [isLowerAssetInsufficientBalance, setIsLowerAssetInsufficientBalance] =
    useRecoilState(isLowerAssetInsufficientBalanceAtom);

  const { executeAddLiquidity } = useLiquidity(
    pair.lpTokenContractAddress,
    pair.pairContractAddress,
  );
  const { chainAssets, refetchChainAssets } = useChainAssets(
    defaultChainInfo.chainId,
  );

  const [changedPairPart, setChangedPairPart] =
    useRecoilState(changedPairPartAtom);

  const poolRatio = usePoolRatio(pair);

  const {
    input,
    setInput,
    handleChange,
    handleBlur,
    isMax,
    isHalf,
    isOverMax,
    toggleMax,
    toggleHalf,
    placeholder,
    resetInput,
  } = useInput({
    negativeExponent: toAssetInfo.decimal,
    max: toAssetInfo.availableAmount,
  });

  useEffect(() => {
    setIsLowerAssetInsufficientBalance(isOverMax);
  }, [setIsLowerAssetInsufficientBalance, isOverMax]);

  useEffect(() => {
    const pair = getPairInfo(
      denomByDisplayDenom(denom as string),
      denomByDisplayDenom(snDenom as string),
    );

    if (!pair) {
      throw new Error("Wrong pair info");
    }
    setPair(pair);
  }, [denom, snDenom]);

  useEffect(() => {
    const upperDecimal = decimalByDisplayDenom(pair.asset0.denom);
    const toDecimal = decimalByDisplayDenom(pair.asset1.denom);
    setUpperAssetInfo({
      decimal: upperDecimal,
      availableAmount: convertBigToFixedString(
        displayBalanceByDenom(pair.asset0.denom, chainAssets),
        upperDecimal,
      ),
    });
    setToAssetInfo({
      decimal: toDecimal,
      availableAmount: convertBigToFixedString(
        displayBalanceByDenom(pair.asset1.denom, chainAssets),
        toDecimal,
      ),
    });
  }, [chainAssets, pair]);

  useEffect(() => {
    if (changedPairPart === PairPart.Lower) {
      return;
    }

    setInput(
      convertBigToFixedString(
        Big(fromAssetInput || 0).mul(poolRatio),
        toAssetInfo.decimal,
      ),
    );
  }, [
    changedPairPart,
    setInput,
    fromAssetInput,
    toAssetInfo.decimal,
    poolRatio,
  ]);

  // Add Execute Button
  const handleAddLiquidityButton = async () => {
    gtag.event({
      action: "click-add-liquidity",
      category: "liquidity",
    });
    setStatus({
      status: TransactionStatus.EXECUTING,
      type: TransactionType.ADDLIQUIDITY,
    });

    const decimalAppliedAmount0 = ParseDecimal(
      fromAssetInput,
      upperAssetInfo.decimal,
    );
    const decimalAppliedAmount1 = ParseDecimal(
      toAssetInput,
      toAssetInfo.decimal,
    );
    const asset0MsgComposer = new MsgComposer(
      pair.denoms[0],
      decimalAppliedAmount0,
    );
    const asset1MsgComposer = new MsgComposer(
      pair.denoms[1],
      decimalAppliedAmount1,
    );

    const result = await executeAddLiquidity(
      asset0MsgComposer,
      asset1MsgComposer,
      pair.pairContractAddress,
    );

    if (!result) {
      setStatus({
        status: TransactionStatus.FAILED,
        type: TransactionType.ADDLIQUIDITY,
      });
      return;
    }

    refetchChainAssets();

    setFromAssetInput("");
    resetInput();

    setStatus({
      status: TransactionStatus.SUCCESS,
      type: TransactionType.ADDLIQUIDITY,
    });
  };

  const downMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "liquidity",
    });

    toggleMax();
    setChangedPairPart(PairPart.Lower);
  };
  const downHalfClicked = () => {
    gtag.event({
      action: "click-half-button",
      category: "liquidity",
    });

    toggleHalf();
    setChangedPairPart(PairPart.Lower);
  };

  const downInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gtag.event({
      action: "input-number",
      category: "liquidity",
    });

    handleChange(e);
    setChangedPairPart(PairPart.Lower);
  };

  useEffect(() => {
    setToAssetInput(input);
  }, [setToAssetInput, input]);

  const { data: exchangeRate } = useExchangeRate(denom, snDenom);
  const zoneName = zoneIdByDisplayDenomMap[denom];
  const { assetUSD, snAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    input,
    input,
  );

  return (
    <div className="relative md:px-8 md:py-8 px-5 py-5">
      <UpperAssetInput
        img={pair.asset0.img}
        denom={pair.asset0.denom}
        balance={upperAssetInfo.availableAmount}
        negativeExponent={upperAssetInfo.decimal}
        pairPoolRatio={Big(1).div(poolRatio).toNumber()}
        assetUSD={assetUSD}
      />
      <div className="relative lnline-block shadow-sm md:rounded-2xl rounded-lg">
        <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-purple-200 border-2 border-purple-300 md:rounded-xl rounded-lg md:px-6 md:py-8 px-3 md:mb-4 mb-2 md:mt-2 mt-1 py-5">
          <div className="absolute top-1 right-0 md:pr-7 pr-4 flex md:pt-1 pt-0 text-blue-500 font-bold text-left md:text-sm text-xs">
            <button
              onClick={downMaxClicked}
              className={clsx(
                "disabled:bg-white ,block bg-white border-2 border-purple-300 rounded md:px-2.5 px-1.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black cursor-pointer",
                {
                  "bg-purple-300": isMax,
                },
              )}
            >
              Max
            </button>
            <button
              onClick={downHalfClicked}
              className={clsx(
                "disabled:bg-white block bg-white border-2 border-purple-300 rounded md:px-2.5 px-1.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black cursor-pointer",
                {
                  "bg-purple-300": isHalf,
                },
              )}
            >
              Half
            </button>
          </div>
          <LiquidityAddBtn />
          <div className="flex-initial col-span-4 mt-3">
            <div className="flex items-start md:space-x-3 space-x-2">
              <img
                className="md:w-10 md:h-10 w-7 h-7 mt-1 bg-gray-300 rounded-full"
                src={`/${pair.asset1.img}`}
                alt=""
              />
              <div className="grid grid-cols-2 justify-items-start items-center">
                <div className="flex items-center cursor-pointer">
                  <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                    {pair.asset1.denom}
                  </h3>
                </div>
                <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                  Balance :{" "}
                  <span className="items-center w-44 truncate">
                    &nbsp;
                    {toAssetInfo.availableAmount}
                    &nbsp;
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-initial col-span-3">
            <div className="group">
              <input
                className="outline-none mt-2 text-black bg-transparent w-full text-right md:text-3xl text-xl mr-1 px-2 font-semibold overflow-x-auto focus:text-black placeholder-gray-700 focus:placeholder-black"
                type="number"
                placeholder={placeholder}
                min="0"
                required
                value={input}
                onChange={downInputChange}
                onBlur={handleBlur}
              />
            </div>
            <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
              ≈ $
              {convertBigToFixedString(
                snAssetUSD.mul(input || "0"),
                upperAssetInfo.decimal,
              )}
            </p>
          </div>
        </div>
      </div>
      <Button
        enabled={enabled}
        transactionStatus={transactionStatus}
        hasValue={
          !!parseFloat(
            changedPairPart === PairPart.Lower ? toAssetInput : fromAssetInput,
          )
        }
        isInsufficient={
          isUpperAssetInsufficientBalance || isLowerAssetInsufficientBalance
        }
        onClick={handleAddLiquidityButton}
        buttonText={"Add"}
        buttonType={TransactionType.ADDLIQUIDITY}
      />
      <AddLiquidityOptions
        fromDisplayDenom={pair.asset0.denom}
        toDisplayDenom={pair.asset1.denom}
        poolRate={poolRatio}
      />
    </div>
  );
};
