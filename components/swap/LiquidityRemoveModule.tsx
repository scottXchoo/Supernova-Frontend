import React, { useEffect, useState } from "react";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
  displayBalanceByDenom,
  imgByDisplayDenomPair,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import {
  useLiquidity,
  useLpBalance,
  useLpDecimal,
  useLpTokenAddress,
  useTotalLpSupply,
} from "core/hooks/useLiquidity";
import { defaultChainInfo } from "core/config/chainInfo";
import { useChainAssets } from "core/hooks/useAssets";
import { useRouter } from "next/router";
import { getNovaAddress, getWasmClient } from "core/state/coreState";
import { usePooledAssetAmounts } from "core/hooks/usePooledAssetAmounts";
import * as gtag from "lib/gtag";
import Big from "big.js";
import clsx from "clsx";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import { ibcAssets } from "core/config/ibcAssets";
import { useWallet } from "core/hooks/useWallet";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import Button from "components/common/Button";

export type ActiveButtonProps = {
  onClick?: () => Promise<void> | void;
  content: string;
};

export const ActiveButton = ({ onClick, content }: ActiveButtonProps) => {
  return (
    <button
      className="inline-block w-full md:py-4 py-3 px-4 text-center font-bold md:text-2xl text-xl md:rounded-2xl rounded-lg text-yellow-500 bg-black hover:bg-gray-900 transform duration-200"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export const LiquidityRemoveModule = () => {
  const [denom0, setDenom0] = useState(
    makeIBCMinimalDenom(
      ibcAssets[0].sourceChannelId,
      ibcAssets[0].coinCurrencies.coinMinimalDenom,
    ),
  );
  const [denom1, setDenom1] = useState("snuatom");
  const [decimal0, setDecimal0] = useState(6);
  const [decimal1, setDecimal1] = useState(18);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [burnPercentage, setBurnPercentage] = useState("100");
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);

  const router = useRouter();
  const denom: string = router.query.denom as string;
  const snDenom: string = router.query.snDenom as string;
  useEffect(() => {
    if (router.isReady) {
      setDenom0(denomByDisplayDenom(denom));
      setDenom1(denomByDisplayDenom(snDenom));
      setDecimal0(decimalByDisplayDenom(denom));
      setDecimal1(decimalByDisplayDenom(snDenom));
    }
  }, [router.isReady]);

  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const lpTokenAddress = useLpTokenAddress(denom0, denom1);
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const { executeRemoveLiquidity, refetchLpBalance, refetchPooledAsset } =
    useLiquidity(lpTokenAddress, pairAddress);
  const { chainAssets, refetchChainAssets } = useChainAssets(
    defaultChainInfo.chainId,
  );
  const { enabled } = useWallet();

  // Asset Balance & img
  const availableAmount = displayBalanceByDenom(denom, chainAssets);
  const availableSnAmount = displayBalanceByDenom(snDenom, chainAssets);
  const { img0, img1 } = imgByDisplayDenomPair(denom, snDenom);

  // LP Balance
  const lpDecimal = useLpDecimal(denom0, denom1);
  const lpTotalSupply = useTotalLpSupply(denom0, denom1);
  const lpBalance = useLpBalance(denom0, denom1);
  const lpPoolShare = lpTotalSupply.eq(0)
    ? Big(0)
    : lpBalance.div(lpTotalSupply);
  const displayLpBalance = lpBalance.div(Big(10).pow(lpDecimal || 0));
  const burnedLpBalance = Big(displayLpBalance).div(100).mul(burnPercentage);

  const unActiveRemoveState =
    Big(burnPercentage).eq(0) || burnedLpBalance.eq(0);

  // Pooled Asset
  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom0,
    denom1,
    decimal0,
    decimal1,
  );

  const denom0Amount = pooledAssetAmount
    .mul(lpPoolShare)
    .div(100)
    .mul(burnPercentage);
  const denom1Amount = pooledSnAssetAmount
    .mul(lpPoolShare)
    .div(100)
    .mul(burnPercentage);

  // Remove Execute Button
  const handleRemoveLiquidityButton = async () => {
    gtag.event({
      action: "click-remove-liquidity",
      category: "liquidity",
    });
    setStatus({
      status: TransactionStatus.EXECUTING,
      type: TransactionType.REMOVELIQUIDITY,
    });

    const decimalAppliedAmount = burnedLpBalance
      .mul(Math.pow(10, lpDecimal || 0))
      .toFixed(0, 0);

    const result = await executeRemoveLiquidity(
      denom0,
      denom1,
      lpTokenAddress,
      pairAddress,
      decimalAppliedAmount,
      wasmClient,
      novaAddress,
    );

    if (!result) {
      setStatus({
        status: TransactionStatus.FAILED,
        type: TransactionType.REMOVELIQUIDITY,
      });
      return;
    }

    refetchChainAssets();
    refetchLpBalance();
    refetchPooledAsset();
    setBurnPercentage("100");

    setStatus({
      status: TransactionStatus.IDLE,
      type: TransactionType.REMOVELIQUIDITY,
    });
  };

  // Remove Button
  useEffect(() => {
    if (unActiveRemoveState) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [unActiveRemoveState]);

  const { data: exchangeRate } = useExchangeRate(denom, snDenom);
  const zoneName = zoneIdByDisplayDenomMap[denom];
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    denom0Amount?.toString() || "0",
    denom1Amount?.toString() || "0",
  );

  return (
    <div className="">
      <div className="relative md:px-8 md:py-8 px-5 py-5">
        <div className="mt-2 mb-12">
          <div className="flex justify-between items-center">
            <p className="md:text-lg text-sm text-black text-left font-medium">
              Amount
            </p>
          </div>
          <h2 className="md:text-7xl text-4xl text-black font-semibold text-left mb-4">
            {burnPercentage}%
          </h2>
          <div>
            <div className="relative">
              <input
                className={clsx(
                  "h-2 relative rounded-full bg-gradient-to-r from-yellow-500 via-purple-500 to-blue-500",
                )}
                onChange={(e) => {
                  setBurnPercentage(e.target.value);
                }}
                type="range"
                id="range"
                name="range"
                step="1"
                min="0"
                max="100"
                value={burnPercentage}
              />
            </div>
            <div className="mt-6 grid grid-cols-4 place-items-stretch md:gap-5 gap-4">
              <button
                onClick={() => {
                  setBurnPercentage("25");
                }}
                className="block bg-gray-700 rounded-md text-center md:text-xl text-lg font-medium text-white hover:bg-blue-500 py-1"
              >
                25%
              </button>
              <button
                onClick={() => {
                  setBurnPercentage("50");
                }}
                className="block bg-gray-700 rounded-md text-center md:text-xl text-lg font-medium text-white hover:bg-blue-500 py-1"
              >
                50%
              </button>
              <button
                onClick={() => {
                  setBurnPercentage("75");
                }}
                className="block bg-gray-700 rounded-md text-center md:text-xl text-lg font-medium text-white hover:bg-blue-500 py-1"
              >
                75%
              </button>
              <button
                onClick={() => {
                  setBurnPercentage("100");
                }}
                className="block bg-gray-700 rounded-md text-center md:text-xl text-lg font-medium text-white hover:bg-blue-500 py-1"
              >
                100%
              </button>
            </div>
          </div>
        </div>
        <div className="relative lnline-block shadow-sm  bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 p-0.5 md:rounded-xl rounded-lg md:mb-4 mb-2 md:mt-2 mt-1">
          <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 md:rounded-xl rounded-lg md:px-6 md:py-5 py-3 px-3">
            <div className="flex-initial col-span-4">
              <div className="flex items-center">
                <img
                  className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full mr-0.5"
                  src={`/${img0}`}
                  alt=""
                />
                <img
                  className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full md:mr-2 mr-1"
                  src={`/${img1}`}
                  alt=""
                />
                <div className="flex items-center">
                  <h3 className="text-black md:text-2xl text-base text-left font-semibold mr-2">
                    {denom}/{snDenom}
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex items-center col-span-3 justify-end">
              <p className="text-black md:text-xl text-base text-right font-semibold">
                {convertBigToFixedString(burnedLpBalance, lpDecimal)}
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-full pt-12 ">
          <div className="absolute md:top-2 top-4 left-1/2 -translate-x-1/2 md:w-12 md:h-12 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-yellow-500 via-yellow-500 to-blue-500 p-0.5">
            <div className="rounded-full static flex justify-center items-center group w-full h-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="22"
                viewBox="0 0 15 22"
                fill="none"
                className="md:w-6 md:h-6 h-4 w-4"
                data-config-id="svg-inline18"
              >
                <path
                  d="M14.5756 13.8583L13.4663 12.7489C13.3527 12.6354 13.1979 12.5683 13.038 12.5683C12.8729 12.5683 12.7232 12.6302 12.6046 12.7489L9.27131 16.0822L9.27131 1.60884C9.27131 1.27345 8.99783 0.999979 8.66245 0.999979L7.09386 0.999979C6.75847 0.999979 6.485 1.27345 6.485 1.60884L6.48499 16.0822L3.15174 12.7489C2.91439 12.5116 2.5274 12.5116 2.29005 12.7489L1.18068 13.8583C1.06717 13.9718 1.00009 14.1266 1.00009 14.2917C1.00009 14.4568 1.06201 14.6065 1.18068 14.7251L7.09901 20.6435C7.31573 20.8602 7.59436 20.9634 7.87815 20.9634C8.16194 20.9634 8.44057 20.855 8.65728 20.6435L14.5808 14.72C14.8181 14.4826 14.8181 14.0956 14.5808 13.8583L14.5756 13.8583Z"
                  fill="#191919"
                  stroke="#191919"
                  strokeWidth="0.3"
                ></path>
              </svg>
            </div>
          </div>
          <p className="md:text-lg text-sm text-black text-left font-medium">
            You will receive
          </p>
        </div>
        <div className="relative lnline-block shadow-sm md:rounded-2xl rounded-lg">
          <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-yellow-200 border-2 border-yellow-500 md:rounded-xl rounded-lg md:px-6 py-3 px-3 md:mb-4 mb-2 md:mt-2 mt-1">
            <div className="flex-initial col-span-4">
              <div className="flex items-start md:space-x-3 space-x-2">
                <div className="grid grid-cols-2 justify-items-start items-center">
                  <div className="flex items-center">
                    <img
                      className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full md:mr-3 mr-1"
                      src={`/${img0}`}
                      alt=""
                    />
                    <h3 className="text-black md:text-2xl text-base text-left font-semibold">
                      {denom}
                    </h3>
                  </div>
                  <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                    Balance :{" "}
                    <span className="items-center w-44 truncate">
                      &nbsp;
                      {convertBigToFixedString(
                        Big(availableAmount || 0),
                        decimal0,
                      )}
                      &nbsp;
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-initial col-span-3">
              <div className="group">
                <p className="text-black md:text-xl text-base text-right font-semibold">
                  {convertBigToFixedString(Big(denom0Amount || 0), decimal0)}
                </p>
                <p className="text-gray-700 text-xs font-semibold text-right truncate md:text-base">
                  ≈ ${estimatedAssetUSD}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative lnline-block shadow-sm md:rounded-2xl rounded-lg">
          <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-purple-200 border-2 border-purple-300 md:rounded-xl rounded-lg md:px-6 py-3 px-3 shadow-sm">
            <div className="absolute md:-top-8 -top-5 left-1/2 -translate-x-1/2 md:w-12 md:h-12 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-yellow-500 via-yellow-500 to-blue-500 p-0.5">
              <div className="rounded-full flex justify-center p-2 items-center w-full h-full bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="md:w-5 md:h-5 h-4 w-4"
                  data-config-id="svg-inline21"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.7766 20C11.1632 20 11.4766 19.6866 11.4766 19.3L11.4766 11.4768H19.3C19.6866 11.4768 20 11.1634 20 10.7768V9.22322C20 8.83662 19.6866 8.52322 19.3 8.52322H11.4766L11.4766 0.7C11.4766 0.313401 11.1632 0 10.7766 0H9.22297C8.83638 0 8.52297 0.313401 8.52297 0.7L8.52297 8.52322H0.7C0.313401 8.52322 0 8.83662 0 9.22322V10.7768C0 11.1634 0.313401 11.4768 0.700001 11.4768H8.52297L8.52297 19.3C8.52297 19.6866 8.83637 20 9.22297 20H10.7766Z"
                    fill="#191919"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="flex-initial col-span-4">
              <div className="flex items-start md:space-x-3 space-x-2">
                <div className="grid grid-cols-2 justify-items-start items-center">
                  <div className="flex items-center">
                    <img
                      className="md:w-8 md:h-8 w-5 h-5 bg-gray-300 rounded-full md:mr-3 mr-1"
                      src={`/${img1}`}
                      alt=""
                    />
                    <h3 className="text-black md:text-2xl text-base text-left font-semibold">
                      {snDenom}
                    </h3>
                  </div>
                  <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                    Balance :{" "}
                    <span className="items-center w-44 truncate">
                      &nbsp;
                      {convertBigToFixedString(
                        Big(availableSnAmount || 0),
                        decimal1,
                      )}
                      &nbsp;
                    </span>{" "}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-initial col-span-3">
              <div className="group">
                <p className="number-scroll-purple text-black md:text-xl text-base text-right font-semibold">
                  {convertBigToFixedString(Big(denom1Amount || 0), decimal1)}
                </p>
                <p className="text-gray-700 text-xs font-semibold text-right truncate md:text-base">
                  ≈ ${estimatedSnAssetUSD}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:mb-2 mb-1 md:mt-10 mt-6">
          <Button
            enabled={enabled}
            transactionStatus={transactionStatus}
            buttonType={TransactionType.REMOVELIQUIDITY}
            hasValue={isValid}
            onClick={handleRemoveLiquidityButton}
            buttonText={"Remove"}
          />
        </div>
      </div>
    </div>
  );
};
