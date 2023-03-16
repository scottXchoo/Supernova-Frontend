import Big from "big.js";
import * as gtag from "lib/gtag";
import useInput from "core/hooks/useInput";
import useNovaBalance from "core/hooks/validators/useNovaBalance";
import { getNovaAddress } from "core/state/coreState";
import {
  delegateOperatorAddressAtom,
  modalsAtom,
  undelegateAmountAtom,
} from "core/state/validators/delegate/delegateModal";
import { validatorFamily } from "core/state/validators/validators";
import {
  MAXIMUM_DECIMAL_POINT,
  NOVA_DECIMAL,
  UNOVA_MINIMAL_DENOM,
} from "core/constants/constants";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { ParseDecimal } from "core/utils/numberFormatter";
import clsx from "clsx";
import { DEFAULT_TIMESTAMP_STRING } from "core/utils/dateTimeFormat";
import InsufficientBalance from "components/swap/InsufficientBalance";
import ValidatorInfo from "../common/ValidatorInfo";
import useUndelegateMutation from "core/hooks/validators/useUndelegateMutation";
import { BackButton, CloseButton } from "../common/IconButtons";
import {
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleString,
} from "../../delegateUtils";
import { delegationFamily } from "core/state/validators/delegate/delegation";

const Undelegation = () => {
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ undelegate }, setIsModalOpen] = useRecoilState(modalsAtom);
  const setUnelegateAmount = useSetRecoilState(undelegateAmountAtom);
  const novaAddress = useRecoilValue(getNovaAddress);
  const operatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const validator = useRecoilValue(validatorFamily(operatorAddress));
  const undelegationMutation = useUndelegateMutation();
  const { data: novaBalance, error: novaBalanceError } =
    useNovaBalance(novaAddress);
  const delegation = useRecoilValue(delegationFamily(operatorAddress));

  const negativeExponent = MAXIMUM_DECIMAL_POINT;
  const decimalDividedAmount = Big(delegation?.amount || 0).div(
    Big(10).pow(NOVA_DECIMAL),
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

  if (
    !undelegate ||
    !validator ||
    !novaBalance ||
    !delegation ||
    novaBalanceError
  )
    return null;

  const onMaxButtonClick = () => {
    gtag.event({
      action: "click-max-button",
      category: "undelegate",
    });

    toggleMax();
  };

  const onUndelegateButtonClick = async () => {
    setUnelegateAmount(inputAmount);
    const undelegateAmount = ParseDecimal(inputAmount, negativeExponent);
    const result = await undelegationMutation.mutateAsync({
      operatorAddress: validator.operatorAddress,
      amount: undelegateAmount,
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
    setUnelegateAmount("0");
  };

  const handleBackButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      manageMyValidator: true,
      undelegate: false,
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between w-full pt-1 relative md:pt-3 md:pb-3 border-b border-yellow-500 md:px-7 px-5 pb-1.5">
        <div className="flex items-center text-white">
          <BackButton onClick={handleBackButtonClicked} />
          <h3 className="text-center md:text-2xl text-lg font-bold ml-2">
            Undelegate
          </h3>
        </div>
        <CloseButton onClick={handleOnClose} />
      </div>
      <div className="block w-full h-full items-center justify-center">
        <div className="relative md:px-8 py-6 px-5 md:py-7">
          <div className="flex items-start mx-auto border-b border-white mb-5 md:mb-6 md:pb-8 pb-5 md:px-4">
            <ValidatorInfo operatorAddress={operatorAddress} />
          </div>
          <div className="flex-wrap relative block bg-gray-800 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-4 mb-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span
                className="text-xs font-bold text-white md:text-sm"
                data-config-id="text18"
              >
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <h3
                className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm w-1/2 md:w-1/3"
                data-config-id="text8"
              >
                Your delegation
              </h3>
              <div className="group grid w-1/2 md:w-2/3 justify-end">
                <p className="font-semibold overflow-x-auto text-right text-white md:text-3xl text-xl">
                  {parseNovaBalanceToLocaleString(delegation.amount)}
                </p>
                <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-purple-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <p
                className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base"
                data-config-id="text15"
              >
                ≈ ${DEFAULT_NUMBER_STRING}
              </p>
            </div>
          </div>
          <div className="flex-wrap relative block bg-yellow-200 border border-yellow-500 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-5 mb-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span
                className="text-xs font-bold md:text-sm text-black"
                data-config-id="text19"
              >
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <div className="flex w-1/2 items-center md:w-2/5 md:pr-3 pr-2">
                <h3
                  className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm leading-tight md:mr-2 mr-1 md:leading-tight"
                  data-config-id="text9"
                >
                  Undelegate Amount
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
                <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-purple-300 opacity-0 group-hover:opacity-100"></div>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <p
                className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base"
                data-config-id="text16"
              >
                ≈ ${DEFAULT_TIMESTAMP_STRING}
              </p>
            </div>
          </div>
          <p
            className="text-white md:text-sm text-xs leading-tight md:leading-tight px-8 text-center md:mb-6 mb-4 md:px-6"
            data-config-id="text17"
          >
            Staking will lock your funds for 14days. You will need to undelegate
            in order to liquidate your staked assets and the process requires
            minimum 14days to undelegate.
          </p>
          {isOverMax ? (
            <InsufficientBalance />
          ) : (
            <button
              onClick={onUndelegateButtonClick}
              disabled={Big(inputAmount || "0").lte(0)}
              className={clsx(
                "inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg font-semibold shadow-sm text-lg",
                Big(inputAmount || "0").gt(0)
                  ? "text-white bg-black hover:bg-opacity-90 hover:text-yellow-500 transform duration-200 bg-transparent ring-inset ring-2 ring-white"
                  : "text-gray-700 bg-gray-400 cursor-not-allowed",
              )}
            >
              Undelegate
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Undelegation;
