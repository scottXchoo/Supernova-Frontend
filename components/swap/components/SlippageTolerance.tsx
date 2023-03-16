import React, { useMemo } from "react";
import {
  SLIPPAGE_VALUES_IN_PERCENT,
  swapSlippageAtom,
  DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT,
} from "core/state/swapState";
import { InfoIcon } from "components/common/info";
import { useRecoilState } from "recoil";
import * as gtag from "lib/gtag";
import clsx from "clsx";
import Big from "big.js";
import { trimUnderNegativeExponent } from "core/utils/numberFormatter";

const SLIPPAGE_DECIMAL = 1;

const MAX_SLIPPAGE_IN_PERCENT = 50;
const MIN_SLIPPAGE_IN_PERCENT = 0;

const getRangedSlippage = (slippage: string) => {
  const slippageInNumber = parseFloat(slippage);

  if (Number.isNaN(slippageInNumber)) {
    return Number(DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT);
  }

  if (slippageInNumber > MAX_SLIPPAGE_IN_PERCENT) {
    return MAX_SLIPPAGE_IN_PERCENT;
  } else if (slippageInNumber < MIN_SLIPPAGE_IN_PERCENT) {
    return MIN_SLIPPAGE_IN_PERCENT;
  } else {
    return slippageInNumber;
  }
};

export const SlippageTolerance = () => {
  const [{ selectedIndex, isManualSelected, manualSlippage }, setSwapSlippage] =
    useRecoilState(swapSlippageAtom);

  const isInvalidSlippage = useMemo(() => {
    if (!manualSlippage) {
      return false;
    }

    const rangedSlippage = getRangedSlippage(manualSlippage);
    return !Big(manualSlippage).eq(rangedSlippage);
  }, [manualSlippage]);

  const handleChangeManualSlippage = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    gtag.event({
      action: "input-slippage-number",
      category: "swap",
      value: e.target.value,
    });

    setSwapSlippage((prev) => {
      return {
        ...prev,
        isManualSelected: true,
        manualSlippage: trimUnderNegativeExponent(
          e.target.value,
          SLIPPAGE_DECIMAL,
        ),
      };
    });
  };

  const handleFocusManualSlippage = () => {
    setSwapSlippage((prev) => {
      {
        return {
          ...prev,
          isManualSelected: true,
        };
      }
    });
  };

  const handleBlurManualSlippage = () => {
    const rangedSlippage = getRangedSlippage(
      manualSlippage || DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT,
    );
    const decimalRefinedSlippage = Big(rangedSlippage).toFixed(
      SLIPPAGE_DECIMAL,
      Big.roundDown,
    );
    setSwapSlippage((prev) => {
      {
        return {
          ...prev,
          manualSlippage: decimalRefinedSlippage,
        };
      }
    });
  };

  return (
    <>
      <div className="flex items-center md:mb-6 mb-3">
        <p className="text-black text-left md:text-xl text-lg font-semibold md:mr-2 mr-1">
          Slippage Tolerance
        </p>
        <InfoIcon content="Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Also, the maximum slippage tolerance you can set is 50%. Use with caution." />
      </div>
      <ul className="grid grid-cols-4 place-items-stretch md:gap-5 gap-4 pb-6 mb-6  border-b border-black">
        {SLIPPAGE_VALUES_IN_PERCENT.map((slippageInPercent, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.preventDefault();
              gtag.event({
                action: "set-slippage",
                category: "swap",
                value: slippageInPercent,
              });
              setSwapSlippage((prev) => ({
                ...prev,
                isManualSelected: false,
                selectedIndex: index,
              }));
            }}
            className={clsx(
              "cursor-pointer block rounded-full text-center md:text-xl text-lg font-medium hover:bg-yellow-500 hover:text-black py-1.5 ",
              {
                "text-black bg-yellow-500":
                  isManualSelected === false && selectedIndex === index,
              },
              {
                "bg-gray-700 text-white":
                  isManualSelected === true ||
                  (isManualSelected === false && selectedIndex !== index),
              },
            )}
          >
            <button>{slippageInPercent} %</button>
          </li>
        ))}
        <li
          className={clsx(
            "relative cursor-pointer items-center justify-center w-full flex rounded-full text-center md:text-xl text-lg font-medium py-1.5 px-2",
            !isManualSelected
              ? "bg-gray-700 text-white"
              : isInvalidSlippage
              ? "bg-red-500 text-white"
              : "bg-yellow-500 text-black",
          )}
        >
          <input
            type="number"
            className="text-center placeholder:text-center focus:outline-none outline-none w-full h-auto bg-transparent mr-4"
            placeholder={`${DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT}%`}
            value={manualSlippage}
            onChange={handleChangeManualSlippage}
            onFocus={handleFocusManualSlippage}
            onBlur={handleBlurManualSlippage}
          />
          <p className="absolute right-2">%</p>
        </li>
      </ul>
    </>
  );
};
