import React, { useMemo, useState } from "react";
import { useWallet } from "core/hooks/useWallet";
import { NovaArrow } from "components/common/novaArrow";
import { useWithdraw } from "core/hooks/useWithdraw";
import { ibcAssets, ibcAssetsDenom } from "core/config/ibcAssets";
import { InfoIcon, unbondingPeriodText } from "components/common/info";
import { useStakeNotice } from "core/hooks/useStakeNotice";
import { TransactionType } from "core/state/transaction";
import Link from "next/link";
import { AutoCompleteList } from "./AutoCompleteList";
import * as gtag from "lib/gtag";
import Big from "big.js";
import Button from "../common/Button";
import { botUnbondingPeriod } from "core/constants/constants";

export const ClaimModule = () => {
  const [openTable, setOpenTable] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { enabled } = useWallet();
  const {
    withdraw,
    setDenom,
    withdrawableAmount,
    denom,
    pendingWithdrawalsAmount,
    chainInfo,
    transactionStatus,
    withdrawRecordObject,
  } = useWithdraw();
  const { claimNotice, setClaim } = useStakeNotice();

  const coinDenomPretty = useMemo(
    () =>
      chainInfo
        ? chainInfo.coinCurrencies.coinDenom
        : ibcAssets[0].coinCurrencies.coinDenom,
    [chainInfo],
  );

  const snDenomPretty = useMemo(
    () =>
      chainInfo
        ? chainInfo.snCurrencies.coinDenom
        : ibcAssets[0].snCurrencies.coinDenom,
    [chainInfo],
  );

  const handleWithdrawButtonClick = async () => {
    gtag.event({
      action: "click-claim-button",
      category: "claim",
    });
    await withdraw();
  };

  const dropdownHandler = () => {
    setOpenDropdown(!openDropdown);
  };

  const onOptionClicked = (values: any) => {
    gtag.event({
      action: "click-option-list",
      category: "claim",
    });
    if (values !== null) {
      setDenom(values);
      setOpenDropdown(false);
    }
  };

  const tableHandler = () => {
    if (withdrawRecordObject.records.length > 0) {
      setOpenTable(!openTable);
    }
  };

  return (
    <React.Fragment>
      <div className="text-center self-center mx-auto bg-white md:rounded-b-2xl rounded-b-lg border-yellow-500 border-b-2 border-r-2 border-l-2 max-w-xl">
        <div className="md:px-8 md:py-8 px-5 py-5">
          {claimNotice && (
            <div className="block bg-blue-500 rounded-lg md:rounded-xl items-center relative justify-center md:px-6 px-4 md:mb-4 mb-2 md:py-6 py-4">
              <div onClick={() => setClaim(false)} className="cursor-pointer">
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
                You will be able to withdraw your staked {coinDenomPretty} and
                rewards <br />
                after your request after the unstaking period expires. <br />
                To unstake, head to
                <Link href={"/unstake"}>
                  <span className="cursor-pointer inline-block w-fit text-yellow-500 font-bold md:text-base text-xs md:leading-tight leading-tight">
                    &nbsp;Unstake&nbsp;
                  </span>
                </Link>
                tab.
              </p>
            </div>
          )}
          <div className="w-full relative inline-block shadow-sm md:rounded-xl rounded-lg md:mb-4 mb-2">
            <div className="grid grid-cols-8 bg-purple-200 place-content-between md:space-x-4 w-full space-x-2 border-2 border-purple-300 md:rounded-xl rounded-lg mx-auto items-center pb-3 md:px-6 px-3">
              <div className="col-span-4 mt-2 md:mr-3 mr-2">
                <p className="text-blue-500 font-bold text-left md:text-base text-xs md:mb-5 mb-1">
                  Total claimable amount
                </p>
                <p className="text-black md:text-3xl text-xl text-left font-semibold w-full number-scroll-purple">
                  {withdrawableAmount}
                </p>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={dropdownHandler}
                >
                  <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                    {coinDenomPretty}
                  </h3>
                  <NovaArrow isRotateTop={openDropdown} />
                </div>
              </div>
              <div className="col-span-4 mt-2">
                <p className="text-black font-bold text-left md:text-sm text-xs md:mb-5 mb-1">
                  Unstaked amount
                </p>
                <p className="text-gray-700 md:text-3xl text-xl text-left font-semibold w-full number-scroll-purple">
                  {pendingWithdrawalsAmount}
                </p>
                <div className="flex items-center">
                  <h3 className="text-gray-700 md:text-3xl text-xl text-left font-semibold">
                    {snDenomPretty}
                  </h3>
                </div>
              </div>
            </div>
            {openDropdown && (
              <div className="absolute w-full -bottom-3">
                <AutoCompleteList
                  assets={ibcAssetsDenom}
                  styles={"purple"}
                  selectedOption={denom}
                  onOptionClicked={onOptionClicked}
                />
              </div>
            )}
          </div>
          <div className="md:rounded-xl rounded-lg mb-6 md:mb-8">
            <button
              type="button"
              onClick={tableHandler}
              className="flex justify-between items-center block bg-gray-200 border-2 border-gray-400 md:rounded-xl rounded-lg mx-auto w-full md:py-5 py-3 md:px-6 px-3 group"
            >
              <span className="text-black font-bold text-left md:text-base text-xs group-hover:text-black">
                Receiving details
              </span>
              <NovaArrow
                isRotateTop={openTable}
                style={"text-purple-300"}
                hover={"group-hover:text-black"}
              />
            </button>
            {openTable && (
              <div className="md:-mt-5 -mt-4 origin-top-right block  bg-gray-200 border-b-2 border-gray-400 w-full border-r-2 border-l-2 md:rounded-b-xl rounded-b-lg md:px-3 md:py-3 py-2 px-2">
                <div className="block border-2 border-gray-400 bg-white md:px-2 md:py-3 md:rounded-xl rounded-lg px-1.5 py-1.5">
                  <div className="grid grid-cols-2 border-b-2 border-dashed border-gray-700 md:px-1.5 px-1 md:pb-1 pb-0.5">
                    <p className="text-gray-700 font-medium text-left md:text-sm text-xs">
                      Est. Time
                    </p>
                    <p className="text-gray-700 font-medium text-right md:text-sm text-xs">
                      You will receive
                    </p>
                  </div>
                  <div className="grid grid-cols-2 border-b-2 border-dashed border-gray-700 md:px-1.5 px-1 md:py-2 py-1 items-center">
                    {withdrawRecordObject.records.map((value, key) => (
                      <React.Fragment key={key}>
                        <p className="text-black text-left font-medium md:text-sm text-xs ">
                          {new Date(
                            new Date(value.completionTime).getTime() + 120000,
                          ).toLocaleTimeString([], {
                            year: "numeric",
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex items-center justify-end md:space-x-3 space-x-1 ">
                          <p className="text-black md:text-sm text-xs text-right font-bold w-full truncate">
                            {value.asset.getAmount()}
                          </p>
                          <p className="text-black font-bold text-right md:text-sm text-xs">
                            {value.asset.assetComponent.displayDenom}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:pt-2 pt-1 md:px-1.5 px-1">
                    <p className="text-purple-300 text-left font-semibold md:text-sm text-xs">
                      Total
                    </p>
                    <div className="flex items-center place-self-end md:space-x-3 space-x-1">
                      <div className="group">
                        <p className="text-blue-500 md:text-sm text-xs text-right font-bold w-full">
                          {withdrawRecordObject.totalAmount?.getAmount()}
                        </p>
                      </div>
                      <p className="text-blue-500 font-bold text-right md:text-sm text-xs">
                        {
                          withdrawRecordObject.totalAmount?.assetComponent
                            .displayDenom
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button
            enabled={enabled}
            transactionStatus={transactionStatus}
            hasValue={Big(withdrawableAmount).gt(0)}
            onClick={handleWithdrawButtonClick}
            buttonText={"Claim"}
            buttonType={TransactionType.CLAIM}
          />
          <div className="grid grid-cols-2 md:mt-10 mt-6">
            <div className="flex items-center md:mb-0.5 mb-1.5">
              <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3 ">
                Unbonding Period
              </p>
              <InfoIcon content={unbondingPeriodText(snDenomPretty)} />
            </div>
            {chainInfo && (
              <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                {chainInfo.unbondingPeriod} ~{" "}
                {Number(chainInfo.unbondingPeriod + botUnbondingPeriod)} Days
              </p>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
