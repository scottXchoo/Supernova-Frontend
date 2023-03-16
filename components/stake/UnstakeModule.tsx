import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useWallet } from "core/hooks/useWallet";
import { NovaArrow } from "components/common/novaArrow";
import { AutoCompleteList } from "./AutoCompleteList";
import { useUnstake } from "core/hooks/useUnstake";
import { useStakeNotice } from "core/hooks/useStakeNotice";
import {
  exchangeRateText,
  InfoIcon,
  unbondingPeriodText,
} from "components/common/info";
import { ibcAssets } from "core/config/ibcAssets";
import Big from "big.js";
import { TransactionStatus, TransactionType } from "core/state/transaction";
import Link from "next/link";
import { StakeModalCompleted, StakeModalInprogress } from "./StakeModal";
import { useWithdraw } from "core/hooks/useWithdraw";
import * as gtag from "lib/gtag";
import Button from "../common/Button";
import useInput from "core/hooks/useInput";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import { botUnbondingPeriod } from "core/constants/constants";

export const UnstakeModule = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { enabled } = useWallet();
  const {
    executeUnstake,
    setAmount,
    setSelectedOption,
    setStatus,
    estimatedReturn,
    snAmount,
    snAssets,
    availableIBCAmount,
    chainInfo,
    selected,
    estimatedRatio,
    transactionStatus,
  } = useUnstake();
  const { setDenom } = useWithdraw();

  const snDenomPretty = useMemo(
    () =>
      selected
        ? selected.assetComponent.displayDenom
        : ibcAssets[0].snCurrencies.coinDenom,
    [selected],
  );
  const coinDenomPretty = useMemo(
    () =>
      chainInfo
        ? chainInfo.coinCurrencies.coinDenom
        : ibcAssets[0].coinCurrencies.coinDenom,
    [chainInfo],
  );

  const negativeExponent = chainInfo.snCurrencies.coinDecimals;
  const maxAmount = Big(selected?.getDisplayedAmount() || 0).toFixed(
    negativeExponent,
    Big.roundDown,
  );
  const {
    input,
    handleChange,
    handleBlur,
    isMax,
    isOverMax,
    toggleMax,
    placeholder,
    resetInput,
  } = useInput({
    negativeExponent,
    max: maxAmount,
  });
  useEffect(() => {
    setAmount(input);
  }, [setAmount, input]);

  const zoneName = zoneIdByDisplayDenomMap[coinDenomPretty];
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    estimatedRatio || Big(1),
    estimatedReturn,
    input,
  );

  const { unstakeNotice, setUnstake } = useStakeNotice();
  const handleUnstakeButtonClick = async () => {
    gtag.event({
      action: "click-unstake-button",
      category: "unstake",
    });
    await executeUnstake();
    resetInput();
  };
  const setUnstakeStatusIdle = () => {
    gtag.event({
      action: "click-unstake-modal-button",
      category: "unstake",
    });
    setStatus({
      status: TransactionStatus.IDLE,
      type: TransactionType.UNSTAKE,
    });
    setDenom(chainInfo.coinCurrencies.coinDenom);
  };

  let Modal = <React.Fragment />;
  if (
    transactionStatus.status == TransactionStatus.EXECUTING &&
    transactionStatus.type == TransactionType.UNSTAKE
  ) {
    Modal = (
      <StakeModalInprogress
        amount={snAmount}
        estimatedAmount={estimatedReturn}
        inputDenom={snDenomPretty}
        estimatedDenom={coinDenomPretty}
        unstake
      />
    );
  } else if (
    transactionStatus.status == TransactionStatus.SUCCESS &&
    transactionStatus.type == TransactionType.UNSTAKE
  ) {
    Modal = <StakeModalCompleted onClick={setUnstakeStatusIdle} />;
  }

  const dropdownHandler = () => {
    setOpenDropdown(!openDropdown);
  };

  const onOptionClicked = (values: any) => {
    gtag.event({
      action: "click-option-list",
      category: "unstake",
    });
    if (values !== null) {
      setSelectedOption(values);
      setOpenDropdown(false);
    }
  };

  const onMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "unstake",
    });

    toggleMax();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gtag.event({
      action: "input-number",
      category: "unstake",
    });
    handleChange(e);
  };

  useEffect(() => {
    setAmount(input);
  }, [setAmount, input]);

  return (
    <React.Fragment>
      {Modal}
      <React.Fragment>
        <div className="text-center self-center mx-auto bg-white md:rounded-b-2xl rounded-b-lg border-yellow-500 border-b-2 border-r-2 border-l-2 max-w-xl">
          <div className="md:px-8 md:py-8 px-5 py-5">
            {unstakeNotice && (
              <div className="block bg-blue-500 rounded-lg md:rounded-xl items-center relative justify-center md:px-6 px-4 md:mb-4 mb-2 md:py-6 py-4">
                <div
                  onClick={() => setUnstake(false)}
                  className="cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute md:top-3 md:right-3 top-2 right-2 md:h-4 md:w-4 h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="md:text-base text-white font-medium text-xs mx-auto tracking-tight md:leading-tight leading-tight text-left">
                  The default unstaking period of {snDenomPretty} is{" "}
                  {chainInfo.unbondingPeriod}~
                  {Number(chainInfo.unbondingPeriod + botUnbondingPeriod)} days.
                  <br />
                  When the unstaking period ends, you can withdraw your
                  <br />
                  staked {coinDenomPretty} and rewards at the
                  <Link href={"/claim"}>
                    <span className="cursor-pointer inline-block w-fit text-yellow-500 font-bold md:text-base text-xs md:leading-tight leading-tight">
                      &nbsp;Claim&nbsp;
                    </span>
                  </Link>
                  tab.
                </p>
              </div>
            )}
            <div className="w-full relative">
              <div
                className="shadow-sm grid grid-cols-8  w-full mx-auto items-center 
              place-content-between bg-purple-200 border-2 border-purple-300 rounded-lg md:px-6 md:py-8 px-3 md:rounded-xl md:mb-4 mb-2 md:mt-2 mt-1 py-5"
              >
                <div className="flex-initial md:col-span-5 col-span-6 mt-2">
                  <div className="flex items-start md:space-x-3 space-x-2">
                    <img
                      className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
                      src={chainInfo.snImagePath}
                      alt=""
                    />
                    <div className="grid grid-cols-2 justify-items-start items-center">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={dropdownHandler}
                      >
                        <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                          {snDenomPretty}
                        </h3>
                        <NovaArrow isRotateTop={openDropdown} />
                      </div>
                      <button
                        onClick={onMaxClicked}
                        className={clsx(
                          "block bg-white border-2 border-purple-300 rounded-md md:px-2.5 px-2 md:text-base text-xs font-bold text-black ml-6 md:ml-16",
                          {
                            "bg-purple-300": isMax,
                          },
                        )}
                      >
                        Max
                      </button>
                      <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                        Balance :{" "}
                        <span className="items-center w-44 truncate">
                          &nbsp;
                          {convertBigToFixedString(
                            Big(maxAmount || 0),
                            negativeExponent,
                          )}
                          &nbsp;
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-initial md:col-span-3 col-span-2">
                  <input
                    className="mt-2 text-black bg-transparent w-full text-right md:text-3xl text-xl mr-1 px-2 font-semibold overflow-x-auto focus:text-black placeholder-gray-700 focus:placeholder-black outline-none"
                    type="number"
                    placeholder={placeholder}
                    min="0"
                    required
                    value={input}
                    onChange={onInputChange}
                    onBlur={handleBlur}
                  />
                  <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-purple-300 opacity-0" />
                  <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
                    ≈ ${estimatedSnAssetUSD}
                  </p>
                </div>
              </div>
              {openDropdown && (
                <AutoCompleteList
                  assets={snAssets}
                  styles={"purple"}
                  selectedOption={selected?.assetComponent.displayDenom || ""}
                  onOptionClicked={onOptionClicked}
                />
              )}
            </div>
            <div className="grid grid-cols-7 relative bg-yellow-200 border-2 border-yellow-500 rounded-lg mx-auto items-center place-content-between md:py-8 md:px-6 px-3 shadow-sm md:rounded-xl mb-6 md:mb-8 py-5">
              <p className="absolute top-0 left-0 md:pl-7 pl-4 text-black font-bold text-left text-xs md:text-base md:pt-3 pt-2">
                You will receive
              </p>
              <div className="flex-initial col-span-4 mt-3">
                <div className="flex items-start md:space-x-3 space-x-2">
                  <img
                    className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
                    src={chainInfo.coinImagePath}
                    alt=""
                  />
                  <div className="grid grid-cols-2 justify-items-start items-center">
                    <div className="flex items-center">
                      <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                        {coinDenomPretty}
                      </h3>
                    </div>
                    <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                      Balance :{" "}
                      <span className="items-center w-44 truncate">
                        &nbsp;
                        {convertBigToFixedString(
                          Big(availableIBCAmount || 0),
                          negativeExponent,
                        )}
                        &nbsp;
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-initial col-span-3 text-right">
                <p className="mt-2 text-gray-700 md:text-3xl text-xl mr-1 px-2 font-semibold overflow-x-auto hover:text-black number-scroll-yellow">
                  {estimatedReturn}
                </p>
                <p className="text-gray-700 text-xs text-right mr-1 px-1 font-semibold truncate md:text-base">
                  ≈ ${estimatedAssetUSD}
                </p>
              </div>
            </div>
            <Button
              enabled={enabled}
              transactionStatus={transactionStatus}
              hasValue={!!parseFloat(estimatedReturn)}
              isInsufficient={isOverMax}
              onClick={handleUnstakeButtonClick}
              buttonText={"Unstake"}
              buttonType={TransactionType.UNSTAKE}
            />
            <div className="grid grid-cols-2 md:mt-10 mt-6">
              <div className="flex items-center md:mb-0.5 mb-1.5">
                <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3 ">
                  Exchange rate
                </p>
                <InfoIcon
                  content={exchangeRateText(coinDenomPretty, snDenomPretty)}
                />
              </div>
              <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                1{snDenomPretty} ≈{" "}
                {Big(1)
                  .div(estimatedRatio.eq(0) ? Big(1) : estimatedRatio)
                  .toFixed(6, 0)}
                {coinDenomPretty}
              </p>
              {chainInfo && (
                <React.Fragment>
                  <div className="flex items-center md:mb-0.5 mb-1.5">
                    <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3 ">
                      Unbonding Period
                    </p>
                    <InfoIcon content={unbondingPeriodText(snDenomPretty)} />
                  </div>
                  <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                    {chainInfo.unbondingPeriod} ~{" "}
                    {chainInfo.unbondingPeriod + botUnbondingPeriod} Days
                  </p>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};
