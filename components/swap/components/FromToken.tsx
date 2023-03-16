import Big from "big.js";
import clsx from "clsx";
import * as gtag from "lib/gtag";
import { NovaArrow } from "components/common/novaArrow";
import { AutoCompleteList } from "components/stake/AutoCompleteList";
import {
  TypeSwapAtom,
  swapInputAtom,
  isSwapInsufficientBalanceAtom,
} from "core/state/swapState";
import { AssetWithAmount } from "core/utils/Asset";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { decimalByDisplayDenom } from "core/utils/byDenomUtils";
import useInput from "core/hooks/useInput";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { isFromDropDownOpenAtom, isToDropDownOpenAtom } from "../SwapModule";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";

interface FromTokenProps {
  fromToken: TypeSwapAtom;
  toToken: TypeSwapAtom;
  supportedAssetList: AssetWithAmount[];
  setSwapUI: (fromToken: AssetWithAmount, toToken: AssetWithAmount) => void;
  fromDisplayBalance: Big;
  position: boolean;
}

const FromToken = ({
  fromToken,
  toToken,
  supportedAssetList,
  fromDisplayBalance,
  setSwapUI,
  position,
}: FromTokenProps) => {
  const setIsToDropDownOpen = useSetRecoilState(isToDropDownOpenAtom);
  const [isDropDownOpen, setIsDropDownOpen] = useRecoilState(
    isFromDropDownOpenAtom,
  );
  const setIsFromDropDownOpen = useSetRecoilState(isFromDropDownOpenAtom);
  const [swapInput, setSwapInput] = useRecoilState(swapInputAtom);
  const setIsInsufficientBalance = useSetRecoilState(
    isSwapInsufficientBalanceAtom,
  );

  const negativeExponent = decimalByDisplayDenom(fromToken.denom);
  const {
    input,
    handleChange,
    handleBlur,
    isMax,
    isHalf,
    isOverMax,
    toggleMax,
    toggleHalf,
    placeholder,
    setInput,
  } = useInput({
    negativeExponent,
    max: fromDisplayBalance.toFixed(negativeExponent, Big.roundDown),
  });

  const onMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "swap",
    });
    toggleMax();
  };

  const onHalfClicked = () => {
    gtag.event({
      action: "click-half-button",
      category: "swap",
    });
    toggleHalf();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gtag.event({
      action: "input-number",
      category: "swap",
    });

    handleChange(e);
  };

  useEffect(() => {
    setIsInsufficientBalance(isOverMax);
  }, [setIsInsufficientBalance, isOverMax]);

  useEffect(() => {
    setSwapInput((prev) => ({
      ...prev,
      inputAmount: input,
    }));
  }, [input, setSwapInput]);

  useEffect(() => {
    setInput(swapInput.inputAmount);
  }, [swapInput.inputAmount, setInput]);

  const onFromOptionClicked = (asset: AssetWithAmount) => {
    gtag.event({
      action: "click-option-list",
      category: "swap",
    });
    const pair = supportedAssetList.find(
      (a) => asset.pairCoinDenom === a.assetComponent.denom,
    );
    if (pair == undefined) {
      return;
    }
    setSwapUI(asset, pair);
    setIsFromDropDownOpen(false);
  };

  const { data: exchangeRate } = useExchangeRate(
    fromToken.denom,
    toToken.denom,
  );
  const zoneName = position
    ? zoneIdByDisplayDenomMap[fromToken.denom]
    : zoneIdByDisplayDenomMap[toToken.denom];
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    input,
    input,
  );
  const estimatedFromAssetUSD = position
    ? estimatedAssetUSD
    : estimatedSnAssetUSD;

  return (
    <div className="relative lnline-block shadow-sm md:rounded-2xl rounded-lg">
      <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-yellow-200 border-2 border-yellow-500 md:rounded-xl rounded-lg md:px-6 md:py-8 px-3 md:mb-4 mb-2 md:mt-2 mt-1 py-5">
        <div className="absolute top-1 right-0 md:pr-7 pr-4 flex md:pt-1 pt-0 text-blue-500 font-bold text-left md:text-sm text-xs">
          <button
            onClick={onMaxClicked}
            className={clsx(
              "disabled:bg-white block bg-white border-2 border-yellow-500 rounded-md md:px-2.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black px-2",
              {
                "bg-yellow-500": isMax,
              },
            )}
          >
            Max
          </button>
          <button
            onClick={onHalfClicked}
            className={clsx(
              "disabled:bg-white block bg-white border-2 border-yellow-500 rounded-md md:px-2.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black px-2",
              {
                "bg-yellow-500": isHalf,
              },
            )}
          >
            Half
          </button>
        </div>
        <div className="flex-initial col-span-4 mt-2 ">
          <div className="flex items-start md:space-x-3 space-x-2">
            <img
              className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
              src={fromToken.imgPath}
              alt="Asset"
            />
            <div className="grid grid-cols-2 justify-items-start items-center">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  setIsDropDownOpen(!isDropDownOpen);
                  setIsToDropDownOpen(false);
                }}
              >
                <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                  {fromToken.denom}
                </h3>
                <NovaArrow isRotateTop={isDropDownOpen} />
              </div>
              <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                Balance :{" "}
                <span className="items-center w-44 truncate">
                  &nbsp;
                  {convertBigToFixedString(
                    fromDisplayBalance,
                    negativeExponent,
                  )}
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
              required
              value={input}
              onChange={onInputChange}
              onBlur={handleBlur}
            />
            <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-yellow-500 opacity-0" />
          </div>
          <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
            ≈ ${estimatedFromAssetUSD || "0"}
          </p>
        </div>
      </div>
      {isDropDownOpen && (
        <AutoCompleteList
          assets={supportedAssetList}
          styles={"yellow"}
          selectedOption={fromToken.denom}
          onOptionClicked={onFromOptionClicked}
        />
      )}
    </div>
  );
};

export default FromToken;
