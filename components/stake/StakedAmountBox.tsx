import Big from "big.js";
import { isAutoClaimModalOpen } from "core/state/autoClaim";
import { SNASSET_DECIMAL } from "core/utils/constants";
import { trimTrailingZeros } from "core/utils/numberFormatter";
import React from "react";
import { useSetRecoilState } from "recoil";

type StakedAmountBoxProps = {
  assetDisplayDenom: string;
  snAssetDisplayDenom: string;
  stakedAmount: Big;
  autoClaimedTime: string;
  estimatedRatio: Big;
};

export default function StakedAmountBox({
  assetDisplayDenom,
  snAssetDisplayDenom,
  stakedAmount,
  autoClaimedTime,
  estimatedRatio,
}: StakedAmountBoxProps) {
  const setIsModalOpen = useSetRecoilState(isAutoClaimModalOpen);
  const estimatedStakedAmount = stakedAmount.mul(estimatedRatio);
  const parsedEstimatedStakedAmount = trimTrailingZeros(
    estimatedStakedAmount.toFixed(SNASSET_DECIMAL, Big.roundDown),
  );
  const handleAutoClaimModalClicked = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      onClick={handleAutoClaimModalClicked}
      className="cursor-pointer border-yellow-500 md:pb-4 md:mb-4 border-b-2 mb-3 pb-3"
    >
      <div className="grid grid-cols-8 w-full group place-content-between border-2 md:rounded-2xl rounded-lg mx-auto items-center pb-3 md:px-6 px-3 shadow-sm bg-gray-100 border-gray-200 md:py-5 py-3 md:space-x-2 hover:bg-gray-200 ease-in-out delay-100">
        <div className="col-span-4 mr-2">
          <div className="relative flex items-center group md:mb-2 mb-2">
            <p
              className="font-bold text-left md:text-base text-xs text-purple-300 mr-2"
              data-config-id="text32"
            >
              Staked Amount
            </p>
          </div>
          <div className="group">
            <p
              className="md:text-3xl text-left font-semibold w-full truncate text-gray-700"
              data-config-id="text33"
            >
              {stakedAmount.toString()}
            </p>
          </div>
          <div className="flex items-center md:-mt-2 -mt-1.5">
            <h3
              className="text-left font-semibold text-sm text-gray-700 md:text-xl ml-1"
              data-config-id="text27"
            >
              {assetDisplayDenom}
            </h3>
          </div>
        </div>
        <div className="col-span-4">
          <div className="relative flex items-center text-gray-700 md:mb-2 mb-2 justify-end">
            <p
              className="md:text-base text-xs text-right font-medium md:mr-5 mr-4"
              data-config-id="text34"
            >
              Est. {autoClaimedTime}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              aria-hidden="true"
              className="absolute h-4 w-4 md:h-5 md:w-5 -right-1"
              data-config-id="svg-inline8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
          <div className="group">
            <p
              className="md:text-3xl text-right font-semibold w-full truncate text-purple-300"
              data-config-id="text35"
            >
              ≈ {parsedEstimatedStakedAmount}
            </p>
          </div>
          <div className="flex items-center justify-end md:-mt-2 -mt-1.5">
            <h3
              className="text-left font-semibold text-purple-300 md:text-xl text-sm"
              data-config-id="text28"
            >
              {snAssetDisplayDenom}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
