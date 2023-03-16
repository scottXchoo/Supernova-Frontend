import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import useStakeLpMutation from "core/hooks/pools/useStakeLpMutation";
import {
  denomByDisplayDenom,
  getPairInfo,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import * as gtag from "lib/gtag";
import { ConfirmButton, InActivateButton } from "./Button";
import { stakeLpModalAtom } from "core/state/pools/lpModalState";
import {
  useLiquidity,
  useLpBalance,
  useLpDecimal,
  useLpTokenAddress,
} from "core/hooks/useLiquidity";
import Big from "big.js";
import clsx from "clsx";
import InsufficientBalance from "components/swap/InsufficientBalance";
import { DEFAULT_TIMESTAMP_STRING } from "core/utils/dateTimeFormat";
import useInput from "core/hooks/useInput";
import { useRouter } from "next/router";
import { ParseDecimal } from "core/utils/numberFormatter";

const StakeLpModal = () => {
  const [
    { inputAmount, isModalOpen, displayDenom, displayShadowDenom },
    setStakeLpModal,
  ] = useRecoilState(stakeLpModalAtom);

  const resetStakeModal = useResetRecoilState(stakeLpModalAtom);
  const denom = denomByDisplayDenom(displayDenom);
  const shadowDenom = denomByDisplayDenom(displayShadowDenom);
  const lpDecimal = useLpDecimal(denom, shadowDenom);
  const lpTokenAddress = useLpTokenAddress(denom, shadowDenom);
  const pairAddress = pairAddressByDenoms(denom, shadowDenom);
  const { refetchLpBalance, refetchPooledAsset } = useLiquidity(
    lpTokenAddress,
    pairAddress,
  );

  const router = useRouter();
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

  // My LP tokens
  const lpBalance = useLpBalance(denom, shadowDenom);
  const displayLpBalance = lpBalance
    .div(Big(10).pow(lpDecimal))
    .round(lpDecimal, Big.roundDown);

  const pairInfo = getPairInfo(denom, shadowDenom);
  const stakeLpMutation = useStakeLpMutation(pairInfo);

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
    resetInput,
  } = useInput({
    negativeExponent: lpDecimal,
    max: displayLpBalance.toFixed(lpDecimal, Big.roundDown),
  });

  useEffect(() => {
    setStakeLpModal((prev) => ({
      ...prev,
      inputAmount: input,
    }));
  }, [input, setStakeLpModal]);

  const handleStakeLpExecuteButton = async () => {
    if (!inputAmount) {
      return;
    }

    gtag.event({
      action: "click-pools-stakeLp",
      category: "pools",
    });
    await stakeLpMutation.mutateAsync({
      lpTokenAddress,
      amount: ParseDecimal(inputAmount, lpDecimal),
    });
    refetchLpBalance();
    refetchPooledAsset();
    resetStakeModal();
    resetInput();
  };

  const handleClose = () => {
    setStakeLpModal((prev) => {
      return {
        ...prev,
        isModalOpen: false,
      };
    });
  };

  const onMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "stake-lp",
    });
    toggleMax();
  };

  const onHalfClicked = () => {
    gtag.event({
      action: "click-half-button",
      category: "stake-lp",
    });
    toggleHalf();
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed h-full bottom-0 w-full bg-black bg-opacity-80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto justify-center items-center flex">
          <div className="flex flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl sm:mx-auto md:max-w-lg max-w-md">
            <div className="absolute z-40 mt-8 md:mx-auto rounded-3xl mx-auto">
              <div className="bg-white grid border-yellow-500 ease-in-out duration-300 z-10 overflow-hidden border-2 rounded-2xl">
                <div className="items-center justify-between w-full block pb-2 px-4 pt-1 md:px-4 bg-black relative md:pt-3 md:pb-3">
                  <div className="flex items-center w-full justify-center">
                    <h3
                      className="text-center md:text-2xl text-lg font-bold ml-2 text-white mt-1 md:mt-0"
                      data-config-id="text3"
                    >
                      Stake LP tokens
                    </h3>
                  </div>
                  <button className="flex flex-wrap" onClick={handleClose}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 transform lg:w-9 lg:h-9 md:w-8 md:h-8 w-7 h-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      data-config-id="svg-inline1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div className="block w-full h-full items-center justify-center">
                  <div className="md:px-8 md:py-6 px-5 py-4">
                    {displayLpBalance.lte(0) && (
                      <div className="block bg-blue-500 rounded-lg md:rounded-xl items-center relative justify-center md:px-6 px-4 md:mb-4 mb-2 md:py-5 py-3">
                        <div className="md:text-base text-white font-medium text-xs mx-auto md:leading-tight leading-tight text-center">
                          No Tokens to stake: Get{" "}
                          <p
                            className="inline-block w-fit font-bold md:text-base text-xs md:leading-tight leading-tight"
                            data-config-id="text10"
                          >
                            {displayDenom}/{displayShadowDenom} LP
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-7 bg-purple-200 border-2 border-purple-300 md:rounded-xl rounded-lg mx-auto items-center place-content-between px-3 shadow-sm md:py-2 md:px-5 py-1.5 md:w-112 w-72 pb-4 md:pb-5 md:mb-10 mb-6">
                      <div className="col-span-7 flex items-center justify-between mt-1">
                        <p
                          className="text-blue-500 font-bold text-left text-xs md:text-base"
                          data-config-id="text5"
                        >
                          Stake LP
                        </p>
                        <div className="flex text-blue-500 font-bold text-left md:text-sm text-xs">
                          <a
                            className={clsx(
                              "cursor-pointer block bg-white border hover:bg-purple-300 border-purple-300 rounded md:px-2.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black px-2",
                              {
                                "bg-purple-300": isMax,
                              },
                            )}
                            onClick={onMaxClicked}
                          >
                            Max
                          </a>
                          <a
                            className={clsx(
                              "cursor-pointer block bg-white border hover:bg-purple-300 border-purple-300 rounded md:px-2.5 md:text-base text-xs font-bold text-black px-2",
                              {
                                "bg-purple-300": isHalf,
                              },
                            )}
                            onClick={onHalfClicked}
                          >
                            Half
                          </a>
                        </div>
                      </div>
                      <div className="flex-initial col-span-4 mt-3">
                        <div className="flex items-start md:space-x-3 space-x-2">
                          <div className="grid grid-cols-2 justify-items-start items-center">
                            <div className="flex items-center col-span-2">
                              <h3
                                className="text-black text-left font-semibold md:text-2xl text-base md:-mt-0.5 -mt-1"
                                data-config-id="text4"
                              >
                                {displayDenom}/{displayShadowDenom} LP
                              </h3>
                            </div>
                            <p
                              className="col-span-2 text-gray-700 text-xs truncate text-right md:text-base -mt-1"
                              data-config-id="text6"
                            >
                              Balance :{" "}
                              {displayLpBalance.toFixed(6, Big.roundDown)}{" "}
                              {displayDenom}/{displayShadowDenom} LP
                            </p>
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
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
                          ≈ ${DEFAULT_TIMESTAMP_STRING}
                        </p>
                      </div>
                    </div>
                    <div className="w-full flex items-center space-x-2  md:mb-4 mb-4">
                      {isOverMax ? (
                        <InsufficientBalance />
                      ) : inputAmount === "0" || inputAmount === "" ? (
                        <InActivateButton content="Confirm" />
                      ) : (
                        <ConfirmButton
                          onClick={handleStakeLpExecuteButton}
                          content="Confirm"
                        />
                      )}
                    </div>
                    <div className="border-t-2 border-yellow-500 md:pt-5 pt-3 flex items-center justify-center">
                      <button
                        className="flex"
                        onClick={(e) =>
                          clickLiquidityState(
                            e,
                            `liquidity/add/${displayDenom}?snDenom=${displayShadowDenom}`,
                          )
                        }
                      >
                        <p
                          className="md:text-lg text-black text-center text-xs font-semibold"
                          data-config-id="text9"
                        >
                          Get {displayDenom}/{displayShadowDenom} LP
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="md:w-7 md:h-7 text-black md:ml-2 ml-1 w-5 h-5"
                          data-config-id="svg-inline2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StakeLpModal;
