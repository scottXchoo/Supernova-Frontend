import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  denomByDisplayDenom,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import { useLiquidity, useLpTokenAddress } from "core/hooks/useLiquidity";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import { ibcAssets } from "core/config/ibcAssets";
import * as gtag from "lib/gtag";

const LiquidityHeader = () => {
  const router = useRouter();
  const path = router.pathname.slice(1);
  const denom: string = router.query.denom as string;
  const snDenom: string = router.query.snDenom as string;
  const [denom0, setDenom0] = useState(
    makeIBCMinimalDenom(
      ibcAssets[0].sourceChannelId,
      ibcAssets[0].coinCurrencies.coinMinimalDenom,
    ),
  );
  const [denom1, setDenom1] = useState("snuatom");
  const lpTokenAddress = useLpTokenAddress(denom0, denom1);
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const { refetchLpBalance, refetchPooledAsset } = useLiquidity(
    lpTokenAddress,
    pairAddress,
  );

  useEffect(() => {
    if (router.isReady) {
      setDenom0(denomByDisplayDenom(denom));
      setDenom1(denomByDisplayDenom(snDenom));
    }
  }, [router.isReady]);

  const handleUpdateButton = async () => {
    gtag.event({
      action: "click-back-liquidity",
      category: "liquidity",
    });
    refetchLpBalance();
    refetchPooledAsset();

    router.back();
  };

  let title;
  let subTitle;
  switch (path) {
    case "liquidity/add":
      title = "Add";
      subTitle = "Receive LP tokens and earn 0.3% trading fees";
      break;
    case "liquidity/remove":
      title = "Remove";
      subTitle = "Remove liquidity to receive tokens back";
      break;
  }
  return (
    <>
      <div className="flex bg-white text-center self-center mx-auto md:rounded-t-2xl rounded-t-lg border-yellow-500 border-t-2 border-r-2 border-l-2 max-w-xl border-b-2 md:px-8 px-4">
        <div className="md:py-4 py-2 w-full">
          <div className="flex items-center mb-0.5 ">
            <div className="flex items-center md:w-1/2 w-2/3">
              <button onClick={handleUpdateButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  className="md:h-6 md:w-6 h-4 w-4 text-gray-500 mt-0.5 md:mr-3 mr-2"
                  data-config-id="svg-inline8"
                >
                  <path
                    d="M22 9.61111L22 12.3889L5.33333 12.3889L12.9722 20.0278L11 22L-4.80825e-07 11L11 1.42652e-06L12.9722 1.97222L5.33333 9.61111L22 9.61111Z"
                    fill="black"
                  ></path>
                </svg>
              </button>
              <p className="text-black text-left md:text-2xl text-lg font-semibold">
                {title} Liquidity
              </p>
            </div>
          </div>
          <p className="md:text-lg text-sm text-gray-700 text-left tracking-tight">
            {subTitle}
          </p>
        </div>
      </div>
    </>
  );
};

export default LiquidityHeader;
