import Big from "big.js";
import clsx from "clsx";
import {
  AssetInfo,
  PairPart,
  changedPairPartAtom,
  lowerAssetInputAtom,
} from "components/swap/LiquidityAddModule";
import { ChangeEvent, useEffect } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import * as gtag from "lib/gtag";
import useInput from "core/hooks/useInput";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { isUpperAssetInsufficientBalanceAtom } from "core/state/liquidity";

export const upperAssetInputAtom = atom({
  key: "upperInput",
  default: "",
});
export const upperAssetInfoAtom = atom<AssetInfo>({
  key: "upperAssetInfo",
  default: {
    availableAmount: "0",
    decimal: 0,
  },
});

const UpperAssetInput = ({
  img,
  denom,
  negativeExponent,
  balance,
  pairPoolRatio,
  assetUSD,
}: {
  img: string;
  denom: string;
  negativeExponent: number;
  balance: string;
  pairPoolRatio: number;
  assetUSD: Big;
}) => {
  const lowerAssetInput = useRecoilValue(lowerAssetInputAtom);
  const [fromAssetInput, setFromAssetInput] =
    useRecoilState(upperAssetInputAtom);
  const setIsUpperAssetInsufficientBalance = useSetRecoilState(
    isUpperAssetInsufficientBalanceAtom,
  );
  const [changedPairPart, setChangedPairPart] =
    useRecoilState(changedPairPartAtom);

  const {
    input,
    setInput,
    handleChange,
    handleBlur,
    isMax,
    isHalf,
    isOverMax,
    toggleMax,
    toggleHalf,
    placeholder,
  } = useInput({
    negativeExponent,
    max: balance,
  });

  useEffect(() => {
    setIsUpperAssetInsufficientBalance(isOverMax);
  }, [setIsUpperAssetInsufficientBalance, isOverMax]);

  const upMaxClicked = () => {
    gtag.event({
      action: "click-max-button",
      category: "liquidity",
    });

    toggleMax();
    setChangedPairPart(PairPart.Upper);
  };
  const upHalfClicked = () => {
    gtag.event({
      action: "click-half-button",
      category: "liquidity",
    });

    toggleHalf();
    setChangedPairPart(PairPart.Upper);
  };

  const upInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    gtag.event({
      action: "input-number",
      category: "liquidity",
    });

    handleChange(e);
    setChangedPairPart(PairPart.Upper);
  };

  useEffect(() => {
    setFromAssetInput(input);
  }, [setFromAssetInput, input]);

  useEffect(() => {
    setInput(fromAssetInput);
  }, [setInput, fromAssetInput]);

  useEffect(() => {
    if (changedPairPart === PairPart.Upper) {
      return;
    }

    const estimatedAmount = Big(lowerAssetInput || 0).mul(pairPoolRatio);
    const parsedEstimatedAmount = convertBigToFixedString(
      estimatedAmount,
      negativeExponent,
    );

    setInput(parsedEstimatedAmount);
  }, [
    changedPairPart,
    setInput,
    lowerAssetInput,
    pairPoolRatio,
    negativeExponent,
  ]);

  return (
    <div className="relative lnline-block shadow-sm md:rounded-2xl rounded-lg">
      <div className="grid grid-cols-7 relative w-full mx-auto items-center place-content-between bg-yellow-200 border-2 border-yellow-500 md:rounded-xl rounded-lg md:px-6 md:py-8 px-3 md:mb-4 mb-2 md:mt-2 mt-1 py-5">
        <div className="absolute top-1 right-0 md:pr-7 pr-4 flex md:pt-1 pt-0 text-blue-500 font-bold text-left md:text-sm text-xs">
          <button
            onClick={upMaxClicked}
            className={clsx(
              "disabled:bg-white ,block bg-white border-2 border-yellow-500 rounded md:px-2.5 px-1.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black cursor-pointer",
              {
                "bg-yellow-500": isMax,
              },
            )}
          >
            Max
          </button>
          <button
            onClick={upHalfClicked}
            className={clsx(
              "disabled:bg-white block bg-white border-2 border-yellow-500 rounded md:px-2.5 px-1.5 md:mr-2 mr-0.5 md:text-base text-xs font-bold text-black cursor-pointer",
              {
                "bg-yellow-500": isHalf,
              },
            )}
          >
            Half
          </button>
        </div>
        <div className="flex-initial col-span-4 mt-2 ">
          <div className="flex items-start md:space-x-3 space-x-2">
            <img
              className="md:w-10 md:h-10 w-7 h-7 mt-1 bg-gray-300 rounded-full"
              src={`/${img}`}
              alt="Asset"
            />
            <div className="grid grid-cols-2 justify-items-start items-center">
              <div className="flex items-center cursor-pointer">
                <h3 className="text-black md:text-3xl text-xl text-left font-semibold">
                  {denom}
                </h3>
              </div>
              <div className="col-span-2 text-gray-700 text-left text-xs truncate md:text-base flex flex-row items-center">
                Balance :{" "}
                <span className="items-center w-44 truncate">
                  &nbsp;
                  {balance}
                  &nbsp;
                </span>{" "}
              </div>
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
              onChange={upInputChange}
              onBlur={handleBlur}
            />
          </div>
          <p className="text-gray-700 text-xs mr-1 px-1 font-semibold text-right truncate md:text-base">
            ≈ $
            {convertBigToFixedString(
              assetUSD.mul(input || "0"),
              negativeExponent,
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpperAssetInput;
