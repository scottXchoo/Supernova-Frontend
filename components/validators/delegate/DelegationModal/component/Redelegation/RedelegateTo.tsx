import useInput from "core/hooks/useInput";
import Big from "big.js";
import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import useRedelegateMutation from "core/hooks/validators/useRedelegateMutation";
import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { redelegateToAddressAtom } from "core/state/validators/delegate/redelegation";
import { validatorFamily } from "core/state/validators/validators";
import {
  APY_ZONE_NAME_NOVA,
  MAXIMUM_DECIMAL_POINT,
  UNOVA_MINIMAL_DENOM,
} from "core/constants/constants";
import { DEFAULT_TIMESTAMP_STRING } from "core/utils/dateTimeFormat";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import { ParseDecimal } from "core/utils/numberFormatter";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { BackButton, CloseButton } from "../../common/IconButtons";
import clsx from "clsx";
import InsufficientBalance from "components/swap/InsufficientBalance";
import {
  parseNovaBalanceToLocaleString,
  calculateValidatorAPR,
  convertValidatorCommissionRate,
} from "components/validators/delegate/delegateUtils";
import { delegationFamily } from "core/state/validators/delegate/delegation";

const RedelegateTo = () => {
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ redelegateTo }, setIsModalOpen] = useRecoilState(modalsAtom);
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  const operatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const delegation = useRecoilValue(delegationFamily(operatorAddress));
  const redelegateToAddress = useRecoilValue(redelegateToAddressAtom);
  const redelegateToValidator = useRecoilValue(
    validatorFamily(redelegateToAddress),
  );
  const redelegateMutation = useRedelegateMutation();

  const negativeExponent = MAXIMUM_DECIMAL_POINT;
  const decimalDividedAmount = Big(delegation?.amount || 0).div(
    Big(10).pow(negativeExponent),
  );

  const maxAvailableAmount = decimalDividedAmount;
  const {
    input: inputAmount,
    handleChange,
    handleBlur,
    isMax,
    isOverMax,
    toggleMax,
    placeholder,
    resetInput: resetInputAmount,
  } = useInput({
    negativeExponent,
    max: maxAvailableAmount.toFixed(negativeExponent, Big.roundDown),
  });

  if (!redelegateTo || !delegation || !redelegateToValidator) return null;

  const handleBackButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      redelegateTo: false,
      redelegateToList: true,
    }));
  };

  const onMaxButtonClick = () => {
    toggleMax();
  };

  const onRedelegateButtonClick = async () => {
    const reDelegateAmount = ParseDecimal(inputAmount, negativeExponent);
    const result = await redelegateMutation.mutateAsync({
      validatorToAddress: redelegateToAddress,
      validatorFromAddress: operatorAddress,
      amount: reDelegateAmount,
      denom: UNOVA_MINIMAL_DENOM,
    });

    if (!result) {
      return;
    }

    resetInputAmount();
    closeAllModal();
  };

  return (
    <>
      <div className="flex items-center justify-between w-full pt-1 relative md:pt-3 md:pb-3 border-b border-yellow-500 md:px-7 px-5 pb-1.5 bg-purple-500">
        <div className="flex items-center text-white">
          <BackButton onClick={handleBackButtonClicked} />
          <h3 className="text-center md:text-2xl text-lg font-bold ml-2">
            Redelegate
          </h3>
        </div>
        <CloseButton onClick={() => closeAllModal()} />
      </div>
      <div className="block w-full h-full items-center justify-center">
        <div className="relative md:px-8 px-5 md:py-7 py-5 md:pb-8 pb-6">
          <div className="mx-auto border-b border-white md:mb-6 md:pb-4 pb-2 mb-2">
            <h3 className="w-full text-white text-left font-semibold md:text-xl md:mb-4 mb-2 text-base">
              You&apos;re redelegate to
            </h3>
            <div className="flex mx-auto bg-gray-800 md:px-6 px-3 md:py-5 py-4 items-center md:rounded-xl rounded-lg md:mb-2">
              <div className="w-full">
                <div className="flex justify-between items-center md:pl-2 pl-2">
                  <h3 className="text-white text-left font-semibold text-lg md:text-xl">
                    {redelegateToValidator.moniker ||
                      makeEllipsisText(redelegateToValidator.operatorAddress)}
                  </h3>
                  <div>
                    <div className="flex items-center justify-start w-full md:mb-2 mb-1 mt-2 md:mt-1">
                      <p className="text-yellow-500 font-semibold text-xs leading-tight md:leading-tight mr-2 md:text-base">
                        Commission
                      </p>
                      <p className="text-white font-semibold text-xs leading-tight md:leading-tight md:text-base">
                        {convertValidatorCommissionRate(
                          redelegateToValidator.commissionRate,
                        )}
                        %
                      </p>
                    </div>
                    <div className="flex items-center justify-start w-full">
                      <p className="text-yellow-500 font-semibold text-xs leading-tight md:leading-tight mr-2 md:text-base">
                        APR
                      </p>
                      <p className="text-white font-semibold text-xs leading-tight md:leading-tight md:text-base">
                        {novaAPR
                          ? calculateValidatorAPR(
                              redelegateToValidator.commissionRate,
                              novaAPR.percent,
                            )
                          : DEFAULT_TIMESTAMP_STRING}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap relative bg-gray-800 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-4 mb-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span className="text-xs font-bold text-white md:text-sm">
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <h3 className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm w-1/2 md:w-1/3">
                {" "}
                Your delegation
              </h3>
              <div className="group grid w-1/2 md:w-2/3 justify-end">
                <p className="font-semibold overflow-x-auto text-right text-white md:text-3xl text-xl">
                  {" "}
                  {parseNovaBalanceToLocaleString(delegation.amount)}
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base">
                ≈ $0
              </p>
            </div>
          </div>
          <div className="flex flex-wrap relative bg-yellow-200 border border-yellow-500 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-5 mb-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span className="text-xs font-bold md:text-sm text-black">
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <div className="flex w-1/2 items-center md:w-2/5 md:pr-3 pr-2">
                <h3 className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm leading-tight md:leading-tight">
                  Redelegate Amount
                </h3>
                <div className="flex text-blue-500 font-bold text-left md:text-sm text-xs">
                  <button
                    onClick={onMaxButtonClick}
                    className={clsx(
                      "rounded md:px-2.5 md:text-base text-xs font-bold text-black px-2 flex items-center md:h-7 h-6 md:border-2 border border-yellow-500 hover:bg-yellow-500",
                      isMax ? "bg-yellow-500" : "bg-white",
                    )}
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="group w-1/2 grid justify-end md:w-3/5">
                <input
                  className="text-black bg-transparent text-right md:text-3xl text-xl font-semibold overflow-x-auto focus:text-black placeholder-gray-700 focus:placeholder-black outline-none"
                  type="number"
                  placeholder={placeholder}
                  min="0"
                  required
                  value={inputAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base">
                ≈ $0
              </p>
            </div>
          </div>
          <p className="text-white md:text-sm text-xs leading-tight md:leading-tight px-8 text-center md:mb-6 mb-4 md:px-6">
            Staking will lock your funds for 14days. You will need to undelegate
            in order to liquidate your staked assets and the process requires
            minimum 14days to undelegate.
          </p>
          {isOverMax ? (
            <InsufficientBalance />
          ) : (
            <button
              onClick={onRedelegateButtonClick}
              disabled={Big(inputAmount || "0").lte(0)}
              className={clsx(
                "inline-block w-full md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-2xl rounded-lg text-white font-semibold shadow-sm",
                Big(inputAmount || "0").gt(0)
                  ? "text-white hover:bg-opacity-90 hover:text-yellow-500 bg-purple-500"
                  : "text-gray-700 bg-gray-400 cursor-not-allowed",
              )}
            >
              Redelegate
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default RedelegateTo;
