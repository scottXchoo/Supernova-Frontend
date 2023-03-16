import { botOraclePeriod } from "core/constants/constants";
import React from "react";

type StakeBlueAlertBoxProps = {
  assetDisplayDenom: string;
  snAssetDisplayDenom: string;
  onClick: () => void;
};

export function StakeBlueAlertBox({
  assetDisplayDenom,
  snAssetDisplayDenom,
  onClick,
}: StakeBlueAlertBoxProps) {
  return (
    <div className="block bg-blue-500 rounded-lg md:rounded-xl items-center relative justify-center md:px-6 px-4 md:mb-4 mb-2 md:py-6 py-4">
      <div onClick={onClick} className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute md:top-3 md:right-3 right-2 md:h-4 md:w-4 h-3 w-3 text-white top-2 -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          data-config-id="svg-inline6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>
      <p className="md:text-base text-white font-medium text-xs mx-auto  md:leading-tight leading-tight text-left -mb-1">
        Your staked {assetDisplayDenom} will be auto-claimed as{" "}
        {snAssetDisplayDenom} to your wallet in every {botOraclePeriod} minutes.
        Check more about{" "}
        <a
          target="_blank"
          rel="noreferrer"
          className="text-white hover:text-yellow-500 font-semibold"
          href="https://medium.com/supernovazone/how-to-drink-champagne-2-b9d5fa899926"
        >
          Supernova’s lazy minting process.
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="inline-block md:h-5 md:w-5 h-4 w-4"
            data-config-id="svg-inline7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
      </p>
    </div>
  );
}
