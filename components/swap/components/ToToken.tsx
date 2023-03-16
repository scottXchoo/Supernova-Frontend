import * as gtag from "lib/gtag";
import React from "react";
import { NovaArrow } from "components/common/novaArrow";
import { SwapBtn } from "components/icons/SwapIcon";
import { AutoCompleteList } from "components/stake/AutoCompleteList";
import { AssetWithAmount } from "core/utils/Asset";
import { TypeSwapAtom } from "core/state/swapState";
import { useRecoilState, useSetRecoilState } from "recoil";
import Big from "big.js";
import {
  decimalByDisplayDenom,
  displayBalanceByDenom,
} from "core/utils/byDenomUtils";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { isFromDropDownOpenAtom, isToDropDownOpenAtom } from "../SwapModule";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";

interface ToTokenProps {
  fromToken: TypeSwapAtom;
  toToken: TypeSwapAtom;
  supportedAssetList: AssetWithAmount[];
  estimatedAmount: Big;
  setSwapUI: (fromToken: AssetWithAmount, toToken: AssetWithAmount) => void;
  handleSwapTokenPositions: () => void;
  position: boolean;
}

const ToToken = ({
  fromToken,
  toToken,
  supportedAssetList,
  estimatedAmount,
  setSwapUI,
  handleSwapTokenPositions,
  position,
}: ToTokenProps) => {
  const setIsFromDropDownOpen = useSetRecoilState(isFromDropDownOpenAtom);
  const [isDropDownOpen, setIsDropDownOpen] =
    useRecoilState(isToDropDownOpenAtom);
  const decimal = decimalByDisplayDenom(toToken.denom);
  const toDisplayBalance = displayBalanceByDenom(
    toToken.denom,
    supportedAssetList,
  );

  const onToOptionClicked = (asset: AssetWithAmount) => {
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
    setSwapUI(pair, asset);
    setIsDropDownOpen(false);
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
    estimatedAmount.toString(),
    estimatedAmount.toString(),
  );
  const estimatedToAssetUSD = position
    ? estimatedSnAssetUSD
    : estimatedAssetUSD;

  return (
    <div className="grid grid-cols-7 relative bg-purple-200 border-2 border-purple-300 md:rounded-xl rounded-lg mx-auto items-center place-content-between md:py-8 md:px-6 px-3 mb-6 shadow-sm md:mb-8 py-5">
      <SwapBtn onTokenSwaps={handleSwapTokenPositions} disable={false} />
      <p className="absolute top-0 left-0 md:pl-7 pl-4 text-blue-500 font-bold text-left text-xs md:text-base md:pt-3 pt-2">
        You will receive
      </p>
      <div className="flex-initial col-span-4 mt-3">
        <div className="flex items-start md:space-x-3 space-x-2">
          <img
            className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
            src={toToken.imgPath}
            alt="snAsset"
          />
          <div className="grid grid-cols-2 justify-items-start items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setIsDropDownOpen(!isDropDownOpen);
                setIsFromDropDownOpen(false);
              }}
            >
              <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                {toToken.denom}
              </h3>
              <NovaArrow isRotateTop={isDropDownOpen} />
            </div>
            <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
              Balance :{" "}
              <span className="items-center w-44 truncate">
                &nbsp;{convertBigToFixedString(toDisplayBalance, decimal)}&nbsp;
              </span>{" "}
            </div>
          </div>
        </div>
      </div>
      {isDropDownOpen && (
        <AutoCompleteList
          assets={supportedAssetList}
          styles={"purple"}
          selectedOption={toToken.denom}
          onOptionClicked={onToOptionClicked}
        />
      )}
      <div className="flex-initial col-span-3 text-right">
        <p className="mt-2 text-gray-700 md:text-3xl text-xl mr-1 px-2 font-semibold overflow-x-auto hover:text-black number-scroll-purple">
          {convertBigToFixedString(estimatedAmount, decimal)}
        </p>
        <p className="text-gray-700 text-xs text-right mr-1 px-1 font-semibold truncate md:text-base">
          ≈ ${estimatedToAssetUSD || "0"}
        </p>
      </div>
    </div>
  );
};

export default ToToken;
