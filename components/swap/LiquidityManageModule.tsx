import React from "react";
import { pairInfo } from "core/config/pairInfo";
import { ManagePairInfo } from "./ManagePairInfo";

export const LiquidityManageModule = () => {
  const managePairInfo = pairInfo?.map((pair) => {
    return (
      <ManagePairInfo
        key={`liquidity/${pair.asset0.denom}/${pair.asset1.denom}`}
        pair={pair}
        displayDenom0={pair.asset0.denom}
        img0={pair.asset0.img}
        displayDenom1={pair.asset1.denom}
        img1={pair.asset1.img}
      />
    );
  });

  return (
    <>
      <div className="md:px-8 px-5 md:py-4 py-2 border-b-2 border-yellow-500 w-full">
        <p className="text-black text-left md:text-2xl text-lg font-semibold">
          Your Liquidity
        </p>
        <p className="-mt-0.5 md:text-lg text-sm text-gray-700 text-left">
          Manage your liquidity
        </p>
      </div>
      <div className="relative md:px-8 md:py-7 px-5 py-5">{managePairInfo}</div>
    </>
  );
};
