import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useStake } from "core/hooks/useStake";
import { useWallet } from "core/hooks/useWallet";
import { NovaArrow } from "components/common/novaArrow";
import { AutoCompleteList } from "./AutoCompleteList";
import {
  exchangeRateText,
  InfoIcon,
  unbondingPeriodText,
} from "components/common/info";
import Big from "big.js";
import { ibcAssets } from "core/config/ibcAssets";
import { TransactionStatus, TransactionType } from "core/state/transaction";
import { StakeModalCompletedAuto, StakeModalInprogress } from "./StakeModal";
import * as gtag from "lib/gtag";
import Button from "../common/Button";
import useInput from "core/hooks/useInput";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import { StakeBlueAlertBox } from "components/common/BlueAlertBox";
import { useStakeNotice } from "core/hooks/useStakeNotice";
import StakedAmountBox from "./StakedAmountBox";
import { useClaimSnAsset } from "core/hooks/useClaimSnAsset";
import { useAutoClaimedTime } from "core/hooks/autoClaim/useAutoClaimedTime";
import { AutoClaimModal } from "./AutoClaimModal";
import { useRecoilState, useRecoilValue } from "recoil";
import Modal from "components/common/Modal";
import { useEstLazyMintingTime } from "core/hooks/autoClaim/useEstLazyMintingTime";
import { useActualLazyMintingTime } from "core/hooks/autoClaim/useActualLazyMintingTime";
import { getNovaAddress } from "core/state/coreState";
import { isAutoClaimModalOpen } from "core/state/autoClaim";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import {
  botOraclePeriod,
  botUnbondingPeriod,
  BOT_PERIOD_UNIT,
  DATE_FORMAT,
} from "core/constants/constants";
import dayjs from "dayjs";

export const StakeModule = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { enabled } = useWallet();
  const novaAddress = useRecoilValue(getNovaAddress);
  const {
    executeStake,
    setAmount,
    setSelectedOption,
    amount,
    estimatedReturn,
    IBCAssets,
    availableSnAmount,
    chainInfo,
    selected,
    estimatedRatio,
    transactionStatus,
  } = useStake();
  const [isAutoClaimModal, setIsModalOpen] =
    useRecoilState(isAutoClaimModalOpen);
  const handleOnClose = () => {
    setIsModalOpen(false);
  };
  const { stakeNotice, setStake } = useStakeNotice();
  const { pendingDepositAmount, claimableAmount } = useClaimSnAsset(chainInfo);
  const negativeExponent = chainInfo.coinCurrencies.coinDecimals;

  const assetClaimableAmount = claimableAmount
    ? Big(claimableAmount)
        .div(estimatedRatio.eq(0) ? Big(1) : estimatedRatio)
        .toFixed(negativeExponent, Big.roundDown)
    : Big(0);
  const stakedAmount = enabled
    ? Big(pendingDepositAmount).plus(assetClaimableAmount)
    : Big(0);
  const isStakedClaimableAmount = Big(stakedAmount).gt(0);

  const coinDenomPretty = useMemo(
    () =>
      selected
        ? selected.assetComponent.displayDenom
        : ibcAssets[0].coinCurrencies.coinDenom,
    [selected],
  );
  const snDenomPretty = useMemo(
    () =>
      chainInfo
        ? chainInfo.snCurrencies.coinDenom
        : ibcAssets[0].snCurrencies.coinDenom,
    [chainInfo],
  );
  const zoneID = zoneIdByDisplayDenomMap[coinDenomPretty];
  const { data: estLazyMintingTime } = useEstLazyMintingTime(zoneID);
  const { data: actualLazyMintingTime } = useActualLazyMintingTime(
    novaAddress,
    zoneID,
  );
  const { data: actualAutoClaimedTime } = useAutoClaimedTime(
    novaAddress,
    zoneID,
  );
  const estAutoClaimedTime = dayjs(estLazyMintingTime)
    .add(botOraclePeriod, BOT_PERIOD_UNIT)
    .format(DATE_FORMAT);

  const autoClaimedTime = actualAutoClaimedTime ?? estAutoClaimedTime;
  const lazyMintingTime = actualLazyMintingTime ?? `Est. ${estLazyMintingTime}`;

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

  const zoneName = zoneIdByDisplayDenomMap[coinDenomPretty];
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    estimatedRatio || Big(1),
    input,
    estimatedReturn,
  );

  useEffect(() => {
    setAmount(input);
  }, [setAmount, input]);

  const handleStakeButtonClick = async () => {
    gtag.event({
      action: "click-stake-button",
      category: "stake",
    });

    const result = await executeStake();

    if (!result) {
      return;
    }

    resetInput();
  };

  //can refactor to component
  let modal = <React.Fragment />;
  if (
    transactionStatus.status == TransactionStatus.EXECUTING &&
    transactionStatus.type == TransactionType.STAKE
  ) {
    modal = (
      <StakeModalInprogress
        amount={amount}
        estimatedAmount={estimatedReturn}
        inputDenom={coinDenomPretty}
        estimatedDenom={snDenomPretty}
      />
    );
  } else if (
    transactionStatus.status == TransactionStatus.SUCCESS &&
    transactionStatus.type == TransactionType.STAKE
  ) {
    modal = <StakeModalCompletedAuto />;
  }

  const dropdownHandler = () => {
    setOpenDropdown(!openDropdown);
  };

  const onOptionClicked = (values: any) => {
    gtag.event({
      action: "click-option-list",
      category: "stake",
    });
    if (values !== null) {
      screen;
      setSelectedOption(values);
      setOpenDropdown(false);
    }
  };

  const onMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "stake",
    });
    toggleMax();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    gtag.event({
      action: "input-number",
      category: "stake",
    });
    handleChange(e);
  };

  return (
    <React.Fragment>
      {modal}
      <React.Fragment>
        <Modal isOpen={isAutoClaimModal} onClose={handleOnClose}>
          <AutoClaimModal
            assetDisplayDenom={coinDenomPretty}
            snAssetDisplayDenom={snDenomPretty}
            stakedAmount={stakedAmount}
            lazyMintingTime={lazyMintingTime}
            autoClaimedTime={autoClaimedTime}
            estimatedRatio={estimatedRatio}
          />
        </Modal>
        <div className="text-center self-center mx-auto bg-white md:rounded-b-2xl rounded-b-lg border-yellow-500 border-b-2 border-r-2 border-l-2 max-w-xl">
          <div className="md:px-8 md:py-8 px-5 py-5">
            <div className="w-full relative">
              {isStakedClaimableAmount ? (
                <StakedAmountBox
                  assetDisplayDenom={coinDenomPretty}
                  snAssetDisplayDenom={snDenomPretty}
                  stakedAmount={stakedAmount}
                  autoClaimedTime={autoClaimedTime}
                  estimatedRatio={estimatedRatio}
                />
              ) : (
                stakeNotice && (
                  <StakeBlueAlertBox
                    assetDisplayDenom={coinDenomPretty}
                    snAssetDisplayDenom={snDenomPretty}
                    onClick={() => setStake(false)}
                  />
                )
              )}
              <div
                className="lnline-block shadow-sm grid grid-cols-7  w-full mx-auto items-center 
              place-content-between bg-yellow-200 border-2 border-yellow-500 rounded-lg md:px-6 md:py-8 px-3 md:rounded-xl md:mb-4 mb-2 md:mt-2 mt-1 py-5"
              >
                <div className="flex-initial col-span-4 mt-2">
                  <div className="flex items-start md:space-x-3 space-x-2">
                    <img
                      className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
                      src={chainInfo.coinImagePath}
                      alt=""
                    />
                    <div className="grid grid-cols-2 justify-items-start items-center">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={dropdownHandler}
                      >
                        <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                          {coinDenomPretty}
                        </h3>
                        <NovaArrow isRotateTop={openDropdown} />
                      </div>
                      <button
                        onClick={onMaxClicked}
                        className={clsx(
                          "block bg-white border-2 border-yellow-500 rounded-md md:px-2.5 md:text-base text-xs font-bold text-black ml-6 md:ml-8 px-2",
                          {
                            "bg-yellow-500": isMax,
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
                <div className="flex-initial col-span-3">
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
                  <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-yellow-500 opacity-0" />
                  <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
                    ≈ ${estimatedAssetUSD}
                  </p>
                </div>
              </div>
              {openDropdown && (
                <AutoCompleteList
                  assets={IBCAssets}
                  styles={"yellow"}
                  selectedOption={selected?.assetComponent.displayDenom || ""}
                  onOptionClicked={onOptionClicked}
                />
              )}
            </div>
            <div className="grid grid-cols-7 relative bg-purple-200 border-2 border-purple-300 rounded-lg mx-auto items-center place-content-between md:py-8 md:px-6 px-3 shadow-sm md:rounded-xl mb-6 md:mb-8 py-5">
              <p className="absolute top-0 left-0 md:pl-7 pl-4 text-blue-500 font-bold text-left text-xs md:text-base md:pt-3 pt-2">
                You will receive
              </p>
              <div className="flex-initial col-span-4 mt-3">
                <div className="flex items-start md:space-x-3 space-x-2">
                  <img
                    className="md:w-10 md:h-10 w-7 h-7 bg-gray-300 rounded-full mt-1"
                    src={chainInfo.snImagePath}
                    alt=""
                  />
                  <div className="grid grid-cols-2 justify-items-start items-center">
                    <div className="flex items-center">
                      <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                        {snDenomPretty}
                      </h3>
                    </div>
                    <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                      Balance :{" "}
                      <span className="items-center w-44 truncate">
                        &nbsp;{availableSnAmount}&nbsp;
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-initial col-span-3 text-right">
                <p className="mt-2 text-gray-700 md:text-3xl text-xl mr-1 px-2 font-semibold hover:text-black number-scroll-purple">
                  {estimatedReturn}
                </p>
                <p className="text-gray-700 text-xs text-right mr-1 px-1 font-semibold truncate md:text-base">
                  ≈ ${estimatedSnAssetUSD}
                </p>
              </div>
            </div>
            <Button
              enabled={enabled}
              transactionStatus={transactionStatus}
              hasValue={!!parseFloat(estimatedReturn)}
              isInsufficient={isOverMax}
              onClick={handleStakeButtonClick}
              buttonText={"Stake"}
              buttonType={TransactionType.STAKE}
            />
            <div className="grid grid-cols-2 md:mt-8 mt-6">
              <div className="flex items-center md:mb-0.5 mb-1.5">
                <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3 ">
                  Exchange rate
                </p>
                <InfoIcon
                  content={exchangeRateText(coinDenomPretty, snDenomPretty)}
                />
              </div>
              <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                1{coinDenomPretty} ≈ {estimatedRatio.toFixed(6, 0)}
                {snDenomPretty}
              </p>
              <div className="flex items-center md:mb-0.5 mb-1.5">
                <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
                  Deposit fee
                </p>
                <InfoIcon
                  content={`There is 0% fee for staking your ${coinDenomPretty} and receiving ${snDenomPretty}.`}
                />
              </div>
              <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                0%
              </p>
              {chainInfo && (
                <React.Fragment>
                  <div className="flex items-center md:mb-0.5 mb-1.5">
                    <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
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
