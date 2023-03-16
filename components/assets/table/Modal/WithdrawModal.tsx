import Big from "big.js";
import {
  convertBalanceToLocaleString,
  getCoinImagePathFromDenom,
} from "components/assets/assetsUtil";
import Modal from "components/common/Modal";
import { CloseButton } from "components/validators/delegate/DelegationModal/common/IconButtons";
import useAssetUsdValue from "core/assets/useAssetUsdValue";
import { defaultChainInfo } from "core/config/chainInfo";
import {
  MAXIMUM_DECIMAL_POINT,
  UNOVA_MINIMAL_DENOM,
} from "core/constants/constants";
import useIBCChainInfo from "core/hooks/assets/useIBCChainInfo";
import useIBCTransferMutation from "core/hooks/assets/useIBCTransferMutation";
import useInput from "core/hooks/useInput";
import { assetSelectorFamily } from "core/state/assets/assets";
import {
  isWithdrawModalOpenAtom,
  withdrawModalDisplayDenomAtom,
} from "core/state/assets/modal";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import { ParseDecimal } from "core/utils/numberFormatter";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Button from "./Button";
import { PurpleHalfMaxButton } from "./ButtonComponents";
import { Arrow } from "./IconButtons";

const WithdrawModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isWithdrawModalOpenAtom);
  const modalDisplayDenom = useRecoilValue(withdrawModalDisplayDenomAtom);
  const balanceData = useRecoilValue(assetSelectorFamily(modalDisplayDenom));
  const novaAddress = useRecoilValue(getNovaAddress);
  const novaClient = useRecoilValue(getNovaClient);
  const {
    address: counterPartyAddress,
    decimal,
    chainName: counterPartyChainName,
    chainInfo,
  } = useIBCChainInfo(balanceData.denom);

  const { mutate, isLoading, isSuccess } = useIBCTransferMutation(
    defaultChainInfo.rpc,
  );

  const {
    input,
    handleChange,
    handleBlur,
    isMax,
    isHalf,
    toggleMax,
    toggleHalf,
    isOverMax,
    placeholder,
    resetInput,
  } = useInput({
    negativeExponent: 6,
    max: balanceData.amount,
  });
  const usdValue = useAssetUsdValue({
    amount: input,
    denom: balanceData.denom,
    displayDenom: balanceData.displayDenom,
  });

  useEffect(() => {
    if (isSuccess) resetInput();
  }, [isSuccess, resetInput]);

  if (!balanceData || !chainInfo) return null;

  const handleWithdrawButtonClicked = () => {
    const withdrawAmount = ParseDecimal(input, decimal);
    mutate({
      client: novaClient,
      senderAddress: novaAddress,
      receipmentAddress: counterPartyAddress,
      transferAmount: withdrawAmount,
      transferDenom: balanceData.denom,
      sourceChannel: chainInfo.sourceChannelId,
    });
  };
  const onMaxClicked = () => {
    toggleMax();
  };

  const onHalfClicked = () => {
    toggleHalf();
  };

  const handleOnClosed = () => {
    resetInput();
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClosed}>
      <div className="bg-white grid border-yellow-500 z-10 overflow-hidden border-2 rounded-2xl">
        <div className="flex items-center justify-between w-full pb-2 px-4 pt-1 md:px-4 bg-black relative md:pt-3 md:pb-3">
          <div className="relative flex items-center w-full justify-center">
            <h3 className="text-center md:text-2xl text-lg font-bold ml-2 text-white mt-1 md:mt-0">
              Withdraw {balanceData.displayDenom}
            </h3>
          </div>
          <CloseButton onClick={handleOnClosed} />
        </div>
        <div className="block w-full h-full items-center justify-center">
          <div className="relative md:px-8 md:py-6 px-5 py-4">
            <div className="relative shadow-sm md:rounded-2xl rounded-lg">
              <div className="flex relative w-full mx-auto items-center justify-center border-2 md:rounded-xl rounded-lg md:px-6 px-3 md:mb-4 mb-2 border-purple-300 bg-white flex-wrap md:py-5 py-4">
                <div className="flex w-full items-center justify-center mb-2 md:mb-3">
                  <img
                    className="md:w-10 md:h-10 bg-gray-300 rounded-full mr-2 md:mr-3 w-6 h-6"
                    src={getCoinImagePathFromDenom(balanceData.denom)}
                    alt=""
                  />
                  <h3 className="text-black text-left font-semibold md:text-2xl text-lg">
                    {counterPartyChainName}
                  </h3>
                </div>
                <div className="w-full flex justify-center mb-2">
                  <p className="border border-gray-500 text-gray-700 text-xs px-4 text-center truncate md:text-base py-1 rounded-md">
                    {makeEllipsisText(counterPartyAddress)}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative block md:rounded-xl rounded-lg mx-auto items-center justify-center  md:py-5 md:px-6 px-3 shadow-sm py-5 md:mb-6 mb-5 bg-white border-2 flex-wrap border-yellow-500">
              <Arrow isUp />
              <div className="flex w-full items-center justify-center mb-2 md:mb-3">
                <img
                  className="md:w-10 md:h-10 bg-gray-300 rounded-full mr-2 md:mr-3 w-6 h-6"
                  src={getCoinImagePathFromDenom(UNOVA_MINIMAL_DENOM)}
                  alt=""
                />
                <h3 className="text-black text-left font-semibold md:text-2xl text-lg">
                  NOVA
                </h3>
              </div>
              <div className="w-full flex justify-center mb-2">
                <p className="border border-gray-500 px-4 text-gray-700 text-xs text-center truncate md:text-base py-1 rounded-md">
                  {makeEllipsisText(novaAddress)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-7 relative bg-purple-200 border-2 border-purple-300 md:rounded-xl rounded-lg mx-auto items-center place-content-between px-3 shadow-sm md:py-2 md:px-5 py-1.5 md:pb-4 pb-3 md:mb-2 mb-1">
              <div className="col-span-7 flex items-center justify-between mt-1">
                <p className="text-blue-500 font-bold text-left text-xs md:text-base">
                  Amount
                </p>
                <div className="flex text-blue-500 font-bold text-left md:text-sm text-xs">
                  <PurpleHalfMaxButton
                    content="Max"
                    isActive={isMax}
                    onClick={onMaxClicked}
                    className="md:px-2.5 md:mr-2 mr-0.5"
                  />
                  <PurpleHalfMaxButton
                    content="Half"
                    isActive={isHalf}
                    onClick={onHalfClicked}
                  />
                </div>
              </div>
              <div className="flex-initial col-span-4 mt-3">
                <div className="flex items-start md:space-x-3 space-x-2">
                  <div className="grid grid-cols-2 justify-items-start items-center">
                    <div className="flex items-center">
                      <h3 className="text-black md:text-3xl text-xl text-left font-semibold -mt-0.5">
                        {balanceData.displayDenom}
                      </h3>
                    </div>
                    <p className="col-span-2 text-gray-700 text-xs truncate text-right md:text-base -mt-1">
                      Balance :{" "}
                      {convertBalanceToLocaleString(
                        balanceData.amount,
                        decimal,
                      )}{" "}
                      {balanceData.displayDenom}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-initial col-span-3 text-right mt-2">
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
                <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base">
                  ≈ $
                  {convertBalanceToLocaleString(
                    usdValue,
                    MAXIMUM_DECIMAL_POINT,
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4 md:mb-4 mb-4">
              <Button
                content="Withdraw"
                onClick={handleWithdrawButtonClicked}
                isOverMax={isOverMax}
                isLoading={isLoading}
                isActive={!!input && Big(input).gt(0)}
              />
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center md:mb-0.5 mb-1.5">
                <p className="text-gray-700 text-left md:text-base text-xs truncate mr-1 md:mr-3">
                  Estimated Time
                </p>
              </div>
              <p className="text-gray-700 text-right text-xs truncate md:text-base md:mb-0.5 mb-1.5">
                30 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default WithdrawModal;
