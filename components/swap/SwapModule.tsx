import React, { useEffect, useState } from "react";
import { MAXIMUM_DECIMAL_POINT } from "core/constants/constants";
import { useSwap } from "core/hooks/useSwap";
import { useWallet } from "core/hooks/useWallet";
import { SlippageTolerance } from "./components/SlippageTolerance";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { AssetWithAmount } from "../../core/utils/Asset";
import { defaultChainInfo } from "core/config/chainInfo";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import {
  swapAtom,
  TypeSwapAtom,
  swapInputAtom,
  isOpenSlippageAtom,
  isSwapInsufficientBalanceAtom,
} from "core/state/swapState";
import { useChainAssets } from "core/hooks/useAssets";
import { SwapOptions } from "./components/Options";
import {
  assetWithAmountFromDenom,
  displayBalanceByDenom,
} from "core/utils/byDenomUtils";
import { useEstimatedAmount } from "core/hooks/useEstimatedAmount";
import * as gtag from "lib/gtag";
import Big from "big.js";
import FromToken from "./components/FromToken";
import ToToken from "./components/ToToken";
import Button from "components/common/Button";

export const isToDropDownOpenAtom = atom<boolean>({
  key: "toToken/isDropDownOpen",
  default: false,
});

export const isFromDropDownOpenAtom = atom<boolean>({
  key: "fromToken/isDropDownOpen",
  default: false,
});

function tokenSwapInfo(
  denom: string,
  amount: Big,
  imgPath: string,
): TypeSwapAtom {
  const convertedAmount = amount?.toFixed(MAXIMUM_DECIMAL_POINT, 0);
  return { denom: denom, amount: Big(convertedAmount), imgPath: imgPath };
}

export const SwapModule = () => {
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);
  const [[fromAsset, toAsset], setTokenSwapState] = useRecoilState(swapAtom);
  const [swapInput, setSwapInput] = useRecoilState(swapInputAtom);
  const [position, setPosition] = useState(true);
  const isInsufficientBalance = useRecoilValue(isSwapInsufficientBalanceAtom);
  const { enabled } = useWallet();
  const { executeSwap } = useSwap();
  const isOpenSlippage = useRecoilValue(isOpenSlippageAtom);
  const { data: estimatedAmount } = useEstimatedAmount(
    fromAsset.denom,
    toAsset.denom,
    swapInput.inputAmount,
  );
  const { chainAssets, refetchChainAssets } = useChainAssets(
    defaultChainInfo.chainId,
  );
  const [supportedAssetList, setSupportedAssetList] = useState<
    AssetWithAmount[]
  >([]);
  const fromDisplayBalance = displayBalanceByDenom(
    fromAsset.denom,
    supportedAssetList,
  );

  // create asset list except nova
  useEffect(() => {
    setSupportedAssetList(chainAssets.slice(1));
  }, [chainAssets]);
  const assetInfo = assetWithAmountFromDenom(fromAsset.denom);

  /** initial value */
  useEffect(() => {
    const fromIndex = supportedAssetList.findIndex(
      (updatedAsset) =>
        updatedAsset.assetComponent.displayDenom === fromAsset.denom,
    );
    const toIndex = supportedAssetList.findIndex(
      (updatedAsset) =>
        updatedAsset.assetComponent.displayDenom === toAsset.denom,
    );

    setTokenSwapState([
      tokenSwapInfo(
        supportedAssetList[fromIndex]?.assetComponent.displayDenom || "ATOM",
        supportedAssetList[fromIndex]?.getDisplayedAmount() || Big(0),
        supportedAssetList[fromIndex]?.assetComponent.imgPath || "atom.svg",
      ),
      tokenSwapInfo(
        supportedAssetList[toIndex]?.assetComponent.displayDenom || "snATOM",
        supportedAssetList[toIndex]?.getDisplayedAmount() || Big(0),
        supportedAssetList[toIndex]?.assetComponent.imgPath || "snAtom.svg",
      ),
    ]);
  }, [supportedAssetList]);

  const handleSwapTokenPositions = () => {
    setTokenSwapState([
      toAsset
        ? toAsset
        : tokenSwapInfo(fromAsset.denom, fromAsset.amount, fromAsset.imgPath),
      fromAsset
        ? fromAsset
        : tokenSwapInfo(toAsset.denom, toAsset.amount, toAsset.imgPath),
    ]);
    setSwapInput({
      inputAmount: "",
      denom0: fromAsset.denom,
      denom1: toAsset.denom,
    });
    setPosition(!position);
  };

  const handleSwapButtonClick = async () => {
    gtag.event({
      action: "click-swap-button",
      category: "swap",
    });
    setStatus({
      status: TransactionStatus.EXECUTING,
      type: TransactionType.SWAP,
    });

    const result = await executeSwap(
      assetInfo,
      fromAsset.denom,
      toAsset.denom,
      swapInput.inputAmount,
    );

    if (!result) {
      setStatus({
        status: TransactionStatus.FAILED,
        type: TransactionType.SWAP,
      });
      return;
    }

    refetchChainAssets();

    setStatus({
      status: TransactionStatus.IDLE,
      type: TransactionType.SWAP,
    });

    setSwapInput({
      inputAmount: "",
      denom0: fromAsset.denom,
      denom1: toAsset.denom,
    });
  };

  function setSwapUI(fromToken: AssetWithAmount, toToken: AssetWithAmount) {
    setTokenSwapState([
      tokenSwapInfo(
        fromToken.assetComponent.displayDenom,
        fromToken.getDisplayedAmount(),
        fromToken.assetComponent.imgPath,
      ),
      tokenSwapInfo(
        toToken.assetComponent.displayDenom,
        toToken.getDisplayedAmount(),
        toToken.assetComponent.imgPath,
      ),
    ]);
    setSwapInput({
      inputAmount: "",
      denom0: fromToken.assetComponent.displayDenom,
      denom1: toToken.assetComponent.displayDenom,
    });
  }

  return (
    <div className="relative md:px-8 md:py-8 px-5 py-5">
      {isOpenSlippage && <SlippageTolerance />}
      <FromToken
        fromToken={fromAsset}
        toToken={toAsset}
        supportedAssetList={supportedAssetList}
        setSwapUI={setSwapUI}
        fromDisplayBalance={fromDisplayBalance}
        position={position}
      />
      <ToToken
        fromToken={fromAsset}
        toToken={toAsset}
        supportedAssetList={supportedAssetList}
        estimatedAmount={Big(estimatedAmount || 0)}
        setSwapUI={setSwapUI}
        handleSwapTokenPositions={handleSwapTokenPositions}
        position={position}
      />
      <Button
        enabled={enabled}
        transactionStatus={transactionStatus}
        hasValue={!!parseFloat(swapInput.inputAmount)}
        isInsufficient={isInsufficientBalance}
        onClick={handleSwapButtonClick}
        buttonText={"Swap"}
        buttonType={TransactionType.SWAP}
      />
      <SwapOptions
        fromDisplayDenom={fromAsset.denom}
        toDisplayDenom={toAsset.denom}
        amount={swapInput.inputAmount}
      />
    </div>
  );
};
