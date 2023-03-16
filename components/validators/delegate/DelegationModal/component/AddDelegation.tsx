import Big from "big.js";
import clsx from "clsx";
import * as gtag from "lib/gtag";
import InsufficientBalance from "components/swap/InsufficientBalance";
import useInput from "core/hooks/useInput";
import useDelegateMutation from "core/hooks/validators/useDelegateMutation";
import useNovaBalance from "core/hooks/validators/useNovaBalance";
import { getNovaAddress } from "core/state/coreState";
import {
  delegateAmountAtom,
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { validatorFamily } from "core/state/validators/validators";
import {
  APY_ZONE_NAME_NOVA,
  MAXIMUM_DECIMAL_POINT,
  UNOVA_MINIMAL_DENOM,
} from "core/constants/constants";
import { DEFAULT_TIMESTAMP_STRING } from "core/utils/dateTimeFormat";
import {
  convertBigToFixedString,
  ParseDecimal,
} from "core/utils/numberFormatter";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { BackButton, CloseButton } from "../common/IconButtons";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import {
  calculateValidatorAPR,
  convertValidatorCommissionRate,
  DEFAULT_NUMBER_STRING,
} from "../../delegateUtils";
import useCoinApy from "core/hooks/priceFeeder/useCoinApy";

const GAS_FEE_FOR_MAX = parseFloat(
  process.env.NEXT_PUBLIC_GAS_FEE_FOR_MAX || "0.012",
);

const AddDelegation = () => {
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ addDelegate }, setIsModalOpen] = useRecoilState(modalsAtom);
  const setDelegateAmount = useSetRecoilState(delegateAmountAtom);
  const novaAddress = useRecoilValue(getNovaAddress);
  const operatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const validator = useRecoilValue(validatorFamily(operatorAddress));
  const delegateMutation = useDelegateMutation();
  const { data: novaBalance, error: novaBalanceError } =
    useNovaBalance(novaAddress);
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);

  const negativeExponent = MAXIMUM_DECIMAL_POINT;
  const decimalDividedAmount = Big(novaBalance?.amount || 0).div(
    Big(10).pow(negativeExponent),
  );

  const maxAvailableAmount = decimalDividedAmount.minus(GAS_FEE_FOR_MAX);
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

  if (!addDelegate || !validator || !novaBalance || novaBalanceError)
    return null;

  const onMaxButtonClick = () => {
    gtag.event({
      action: "click-max-button",
      category: "delegate",
    });

    toggleMax();
  };

  const onDelegateButtonClick = async () => {
    setDelegateAmount(inputAmount);
    const delegateAmount = ParseDecimal(inputAmount, negativeExponent);
    const result = await delegateMutation.mutateAsync({
      operatorAddress: validator.operatorAddress,
      amount: delegateAmount,
      denom: UNOVA_MINIMAL_DENOM,
    });

    if (!result) {
      return;
    }

    resetInputAmount();
    closeAllModal();
  };

  const handleOnClose = () => {
    closeAllModal();
    resetInputAmount();
    setDelegateAmount("0");
  };

  const handleBackButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      addDelegate: false,
      manageMyValidator: true,
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between w-full pt-1 relative md:pt-3 md:pb-3 border-b border-yellow-500 md:px-7 px-5 pb-1.5 bg-blue-500">
        <div className="flex items-center text-white">
          <BackButton onClick={handleBackButtonClicked} />
          <h3 className="text-center md:text-2xl text-lg font-bold ml-2">
            Add Delegate
          </h3>
        </div>
        <CloseButton onClick={handleOnClose} />
      </div>
      <div className="block w-full h-full items-center justify-center">
        <div className="relative md:px-8 py-6 px-5 md:py-7">
          <div className="flex items-start mx-auto border-b border-white mb-5 md:mb-6 md:pb-8 pb-5 md:px-4">
            <div className="w-full md:mb-6 mb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-white text-left font-semibold text-lg md:text-xl">
                  {validator.moniker ||
                    makeEllipsisText(validator.operatorAddress)}
                </h3>
                <div className="md:mr-4 mr-2">
                  <div className="flex items-center justify-start w-full md:mb-2 mb-1 lg:mt-1 mt-2">
                    <p className="text-yellow-500 font-semibold text-xs leading-tight md:leading-tight mr-2 md:text-base">
                      Commission
                    </p>
                    <p className="text-white font-semibold text-xs leading-tight md:leading-tight md:text-base">
                      {convertValidatorCommissionRate(validator.commissionRate)}
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
                            validator.commissionRate,
                            novaAPR.percent,
                          )
                        : DEFAULT_NUMBER_STRING}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap relative bg-yellow-200 border border-yellow-500 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-5 mb-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span className="text-xs font-bold md:text-sm text-black">
                Available : {convertBigToFixedString(decimalDividedAmount, 6)}{" "}
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <div className="flex w-1/2 items-center md:w-2/5">
                <h3 className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm leading-tight md:mr-2 mr-1">
                  New Amount
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
                ≈ ${DEFAULT_TIMESTAMP_STRING}
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
              onClick={onDelegateButtonClick}
              disabled={Big(inputAmount || "0").lte(0)}
              className={clsx(
                "inline-block w-full md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-2xl rounded-lg text-white font-semibold shadow-sm",
                Big(inputAmount || "0").gt(0)
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "bg-gray-700 cursor-not-allowed",
              )}
            >
              Add Delegate
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default AddDelegation;
