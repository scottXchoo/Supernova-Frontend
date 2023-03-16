import clsx from "clsx";
import { DEFAULT_NUMBER_STRING } from "components/validators/delegate/delegateUtils";
import useAssetUsdValue from "core/assets/useAssetUsdValue";
import {
  MAXIMUM_DECIMAL_POINT,
  NOVA_DISPLAY_DENOM,
  PREFIX_IBC,
} from "core/constants/constants";
import { useWallet } from "core/hooks/useWallet";
import { MD_WINDOW_SIZE, useWindowSize } from "core/hooks/useWindowSize";
import { assetSelectorFamily, assetUSDFamily } from "core/state/assets/assets";
import {
  depositModalDisplayDenomAtom,
  isDepositModalOpenAtom,
  isWithdrawModalOpenAtom,
  withdrawModalDisplayDenomAtom,
} from "core/state/assets/modal";
import { decimalByDisplayDenom } from "core/utils/byDenomUtils";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  getCoinImagePathFromDenom,
  convertBalanceToLocaleString,
} from "../assetsUtil";
import AssetsButton from "./AssetsButton";
import MobileDropdownButton from "./MobileDropdownButton";

interface TableRowProps {
  displayDenom: string;
  index: number;
}

const TableRow = ({ displayDenom, index }: TableRowProps) => {
  const { isMobile } = useWindowSize(MD_WINDOW_SIZE);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const { enabled } = useWallet();
  const balanceData = useRecoilValue(assetSelectorFamily(displayDenom));
  const setUSDValue = useSetRecoilState(assetUSDFamily(displayDenom));
  const usdValue = useAssetUsdValue({ ...balanceData });

  const isIBCTransferAvailable = balanceData.denom.startsWith(PREFIX_IBC);
  const setIsWithdrawModalOpen = useSetRecoilState(isWithdrawModalOpenAtom);
  const setWithdrawModalDisplayDenom = useSetRecoilState(
    withdrawModalDisplayDenomAtom,
  );
  const setIsDepositModalOpen = useSetRecoilState(isDepositModalOpenAtom);
  const setDepositModalDisplayDenom = useSetRecoilState(
    depositModalDisplayDenomAtom,
  );

  const isAbleToShowDollars = displayDenom !== NOVA_DISPLAY_DENOM;

  useEffect(() => {
    setUSDValue(usdValue);
  }, [setUSDValue, usdValue]);

  const withdrawButtonClicked = () => {
    setWithdrawModalDisplayDenom(balanceData.displayDenom);
    setIsWithdrawModalOpen(true);
  };

  const depositButtonClicked = () => {
    setDepositModalDisplayDenom(balanceData.displayDenom);
    setIsDepositModalOpen(true);
  };
  return (
    <>
      {!isMobile ? (
        <tr
          className={clsx(
            "lg:text-lg md:text-sm text-xs",
            index % 2 !== 0 && "bg-gray-300",
          )}
        >
          <td className="relative font-medium md:h-16 mb-1 h-12 md:pl-3 pr-10 md:pr-5">
            <div className="flex items-center">
              <div>
                <div className="relative lg:w-12 lg:h-12 w-9 h-9 md:mr-3">
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-black">
                    {index + 1}
                  </span>
                </div>
              </div>
              <div className="flex items-center flex-shrink-0">
                <img
                  className="bg-gray-300 rounded-full md:mr-3 lg:w-8 lg:h-8 md:w-7 md:h-7 h-5 w-5 mr-2"
                  src={getCoinImagePathFromDenom(balanceData.denom) || ""}
                  alt=""
                />
                <span className="text-black font-semibold leading-tight">
                  {balanceData.displayDenom}
                </span>
              </div>
            </div>
          </td>
          <td className="text-black md:h-16 mb-1 text-right py-2 lg:py-3 h-12 lg:pr-10 pr-8">
            <div className="flex flex-col items-end text-right">
              <p className="font-semibold">
                {convertBalanceToLocaleString(
                  balanceData.amount,
                  decimalByDisplayDenom(balanceData.displayDenom),
                )}
              </p>
              <p className="md:text-sm text-xs md:-mt-2 -mt-1 text-gray-700 leading-tight w-28">
                $
                {isAbleToShowDollars
                  ? convertBalanceToLocaleString(
                      usdValue,
                      MAXIMUM_DECIMAL_POINT,
                    )
                  : DEFAULT_NUMBER_STRING}
              </p>
            </div>
          </td>
          <td className="text-black md:h-16 mb-1 py-2 lg:py-3 h-12 text-center lg:pr-8 lg:px-0 px-4">
            <div className="flex w-full items-center lg:justify-end justify-center">
              {isIBCTransferAvailable && (
                <AssetsButton
                  label="Deposit"
                  onClick={depositButtonClicked}
                  enabled={enabled}
                />
              )}
            </div>
          </td>
          <td className="relative text-black md:h-16 mb-1 text-right py-2 h-12 lg:py-4 lg:pl-8 lg:px-0 px-4 pr-8">
            <div className="flex items-center justify-start">
              {isIBCTransferAvailable && (
                <AssetsButton
                  label="Withdraw"
                  onClick={withdrawButtonClicked}
                  enabled={enabled}
                />
              )}
            </div>
          </td>
        </tr>
      ) : (
        <>
          <tr
            className={clsx(
              "lg:text-lg md:text-sm text-base",
              index % 2 !== 0 && "bg-gray-300",
            )}
          >
            <td className="relative font-medium mb-1 md:pl-3 h-16">
              <div className="flex items-center">
                <div>
                  <div className="relative lg:w-12 lg:h-12 h-9 md:mr-3 w-8 mr-1">
                    <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-black">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex items-center flex-shrink-0">
                  <img
                    className="bg-gray-300 rounded-full md:mr-3 lg:w-8 lg:h-8 md:w-7 md:h-7 h-5 w-5 mr-2"
                    src={getCoinImagePathFromDenom(balanceData.denom) || ""}
                    alt=""
                  />
                  <span className="text-black font-semibold leading-tight">
                    {balanceData.displayDenom}
                  </span>
                </div>
              </div>
            </td>
            <td className="text-black md:h-16 mb-1 text-right py-2 lg:py-3">
              <div className="flex flex-col items-end text-right">
                <p className="font-semibold">
                  {convertBalanceToLocaleString(
                    balanceData.amount,
                    decimalByDisplayDenom(balanceData.displayDenom),
                  )}
                </p>
                <p className="md:text-sm text-xs md:-mt-2 text-gray-700 leading-tight w-28 -mt-1.5">
                  $
                  {isAbleToShowDollars
                    ? convertBalanceToLocaleString(
                        usdValue,
                        MAXIMUM_DECIMAL_POINT,
                      )
                    : DEFAULT_NUMBER_STRING}
                </p>
              </div>
            </td>
            <td className="text-black md:h-16 mb-1 py-2 lg:py-3 h-12 text-center px-3 w-24">
              <div className="flex items-center lg:justify-end justify-center w-full">
                {isIBCTransferAvailable && (
                  <MobileDropdownButton
                    onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                    isOpen={isOpenDropdown}
                  />
                )}
              </div>
            </td>
          </tr>
          {isOpenDropdown && (
            <tr className="bg-gray-300">
              <td className="pb-5 pt-2">
                <div className="flex justify-start pl-7">
                  <AssetsButton
                    label="Deposit"
                    onClick={depositButtonClicked}
                    enabled={enabled}
                  />
                </div>
              </td>
              <td className="pt-2 pb-5">
                <div className="flex justify-end -mx-7">
                  <AssetsButton
                    label="Withdraw"
                    onClick={withdrawButtonClicked}
                    enabled={enabled}
                  />
                </div>
              </td>
              <td className="w-24"></td>
            </tr>
          )}
        </>
      )}
    </>
  );
};
export default TableRow;
