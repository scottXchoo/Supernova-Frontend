import useValidators from "core/hooks/validators/useValidators";
import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import useMyValidators from "core/hooks/validators/useMyValidators";
import { getNovaAddress } from "core/state/coreState";
import { isMyValidatorsShownAtom } from "core/state/validators/showMyValidators";
import { EmptyDataUI } from "components/proposal/list/EmptyDataUI";
import DelegationModal from "components/validators/delegate/DelegationModal";
import {
  calculateValidatorAPR,
  convertDecimalToPercentage,
  convertValidatorCommissionRate,
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleStringRoundDown,
} from "./delegate/delegateUtils";
import { APY_ZONE_NAME_NOVA } from "core/constants/constants";

const List = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  const isMyValidatorsShown = useRecoilValue(isMyValidatorsShownAtom);
  const setOperatorAddress = useSetRecoilState(delegateOperatorAddressAtom);
  const { data: validatorsData, error: validatorsError } = useValidators();
  const { data: myValidatorsData, error: myValidatorsError } =
    useMyValidators(novaAddress);
  const setModalOpenState = useSetRecoilState(modalsAtom);

  if (
    !validatorsData ||
    !myValidatorsData ||
    validatorsError ||
    myValidatorsError
  )
    return null;
  const listData = isMyValidatorsShown ? myValidatorsData : validatorsData;
  const handleDelegateButtonClicked = (address: string) => {
    setOperatorAddress(address);
    const isMyValidator = myValidatorsData.find(
      (validator) => validator.operatorAddress === address,
    );
    setModalOpenState((prev) => ({
      ...prev,
      baseModal: true,
      [isMyValidator ? "manageMyValidator" : "manageValidator"]: true,
    }));
  };

  return (
    <div className="w-full h-full lg:mb-20 md:mb-14 mb-6">
      <div className="ml-auto overflow-x-auto">
        {listData.length === 0 ? (
          <EmptyDataUI />
        ) : (
          <div className="inline-block min-w-full rounded-md bg-gray-900">
            <table className="table-auto w-full text-white">
              <thead>
                <tr className="md:text-sm text-xs text-yellow-500 lg:text-base">
                  <th className="font-semibold text-left pl-16 h-10 lg:h-24 md:h-16 lg:pl-28 md:pl-24">
                    Validator
                  </th>
                  <th className="font-semibold text-right px-3 lg:h-24 md:px-8 md:h-16">
                    Votes(%)
                  </th>
                  <th className="font-semibold md:px-8 px-5 text-center lg:h-24 md:h-16">
                    Commission
                  </th>
                  <th className="font-semibold text-center lg:h-24 md:h-16">
                    APR
                  </th>
                  <th className="font-semibold md:px-8 text-center px-5 lg:h-24 md:h-16">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData.map((validator, index) => (
                  <tr
                    key={validator.operatorAddress}
                    className="bg-gray-400 md:text-sm text-xs bg-opacity-10 lg:text-base"
                  >
                    <td className="font-medium md:h-16 lg:pl-8 py-2 lg:py-4 lg:pr-5 h-12 md:pl-4 relative pr-10 md:pr-5 lg:h-24 md:py-3">
                      <div className="items-center flex">
                        <div className="relative lg:w-12 lg:h-12 w-9 h-9 lg:mr-6 md:mr-3 lg:text-xl md:text-base text-sm">
                          <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="items-center flex flex-shrink-0">
                          <span className="font-semibold leading-tight">
                            {validator.moniker ||
                              makeEllipsisText(validator.operatorAddress)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="md:h-16 text-right py-2 lg:py-4 h-12 lg:h-24 md:px-8 px-3">
                      <p className="font-semibold text-right">
                        {parseNovaBalanceToLocaleStringRoundDown(
                          validator.delegatorShares,
                        )}
                        ({convertDecimalToPercentage(validator.voteShare)}
                        %)
                      </p>
                    </td>
                    <td className="md:h-16 py-2 lg:py-3 h-12 md:px-8 px-5 text-center lg:h-24">
                      <p className="font-semibold lg:w-28 mx-auto md:w-20 w-16">
                        {convertValidatorCommissionRate(
                          validator.commissionRate,
                        )}
                        %
                      </p>
                    </td>
                    <td className="relative md:h-16 py-2 h-12 lg:py-4 text-center px-5 lg:h-24">
                      <p className="font-semibold lg:w-28 mx-auto md:w-20 w-16">
                        {novaAPR
                          ? calculateValidatorAPR(
                              validator.commissionRate,
                              novaAPR?.percent,
                            )
                          : DEFAULT_NUMBER_STRING}
                        %
                      </p>
                      <div className="absolute -bottom-px right-0 w-10 h-px bg-darkBlueGray-500"></div>
                    </td>
                    <td className="md:h-16 py-2 lg:py-3 h-12 lg:py-4 text-center px-5 lg:h-24 md:px-10">
                      <button
                        onClick={() => {
                          handleDelegateButtonClicked(
                            validator.operatorAddress,
                          );
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="20"
                          viewBox="0 0 28 20"
                          fill="currentColor"
                          className="text-white place-self-end col-span-1 md:w-5 md:h-5 w-4 lg:h-6 lg:w-6 h-4"
                        >
                          <path
                            d="M7 2.94453C7 3.75764 6.34084 4.4168 5.52773 4.4168H1.47227C0.659156 4.4168 0 3.75764 0 2.94453C0 2.13142 0.659156 1.47227 1.47227 1.47227H5.52773C6.34084 1.47227 7 2.13142 7 2.94453ZM7 10.3059C7 9.49275 6.34084 8.83359 5.52773 8.83359H1.47227C0.659156 8.83359 0 9.49275 0 10.3059C0 11.119 0.659156 11.7781 1.47227 11.7781H5.52773C6.34084 11.7781 7 11.119 7 10.3059ZM27.0633 18.0486C26.499 18.642 25.553 18.642 24.9887 18.0486L23.0623 16.0228C21.6799 14.569 19.4306 14.5012 17.4335 14.6925C17.225 14.7124 17.0138 14.7227 16.8 14.7227C12.936 14.7227 9.8 11.4248 9.8 7.36133C9.8 3.29787 12.936 0 16.8 0C20.664 0 23.8 3.29787 23.8 7.36133C23.8 7.6204 23.7871 7.87597 23.762 8.12751C23.5572 10.178 23.6288 12.4547 25.0469 13.9499L27.0646 16.0773C27.5888 16.63 27.5883 17.4966 27.0633 18.0486ZM21 7.36133C21 4.93209 19.11 2.94453 16.8 2.94453C14.49 2.94453 12.6 4.93209 12.6 7.36133C12.6 9.79056 14.49 11.7781 16.8 11.7781C19.11 11.7781 21 9.79056 21 7.36133ZM0 17.6672C0 18.4803 0.659156 19.1395 1.47227 19.1395H12.5277C13.3408 19.1395 14 18.4803 14 17.6672C14 16.8541 13.3408 16.1949 12.5277 16.1949H1.47227C0.659156 16.1949 0 16.8541 0 17.6672Z"
                            fill="white"
                            data-path="0.1.0.0.0.0.1.0.4.0.0.0"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <DelegationModal />
    </div>
  );
};

export default List;
