import useValidators from "core/hooks/validators/useValidators";
import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import React, { useMemo } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import { EmptyDataUI } from "components/proposal/list/EmptyDataUI";
import DelegationModal from "components/validators/delegate/DelegationModal";
import {
  calculateValidatorAPR,
  convertDecimalToPercentage,
  convertValidatorCommissionRate,
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleStringRoundDown,
} from "./delegate/delegateUtils";
import clsx from "clsx";
import { delegatedValidatorAddressesAtom } from "core/state/validators/delegate/delegation";
import { APY_ZONE_NAME_NOVA } from "core/utils/constants";
import { ValidatorStatusFilter } from "./ValidatorStatusFilter";
import { Validator } from "core/queries/validators/type";
import { filteredValidatorStatusAtom } from "core/state/validators/validators";
import { useWallet } from "core/hooks/useWallet";
import EditButton from "./delegate/EditButton";

const ValidatorLists = () => {
  const { enabled } = useWallet();
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  const setOperatorAddress = useSetRecoilState(delegateOperatorAddressAtom);
  const { data: allValidatorList } = useValidators();
  const filteredValidatorStatus = useRecoilValue(filteredValidatorStatusAtom);
  const myDelegatedValidatorList = useRecoilValue(
    delegatedValidatorAddressesAtom,
  );
  const setModalOpenState = useSetRecoilState(modalsAtom);

  const handleDelegateButtonClicked = (address: string) => {
    setOperatorAddress(address);
    const isMyValidator = myDelegatedValidatorList.find(
      (validatorAddress) => validatorAddress === address,
    );
    setModalOpenState((prev) => ({
      ...prev,
      baseModal: true,
      [isMyValidator ? "manageMyValidator" : "manageValidator"]: true,
    }));
  };

  const activeValidatorList = useMemo(
    () =>
      allValidatorList.filter((validator) => {
        return validator.filteredValidatorStatus === "active";
      }),
    [allValidatorList],
  );
  const inactiveValidatorList = useMemo(
    () =>
      allValidatorList.filter((validator) => {
        return validator.filteredValidatorStatus === "inactive";
      }),
    [allValidatorList],
  );
  const jailedValidatorList = useMemo(
    () =>
      allValidatorList.filter((validator) => {
        return validator.filteredValidatorStatus === "jailed";
      }),
    [allValidatorList],
  );

  let selectedValidatorStatus: Validator[] = [];
  switch (filteredValidatorStatus) {
    case "active":
      selectedValidatorStatus = activeValidatorList;
      break;
    case "inactive":
      selectedValidatorStatus = inactiveValidatorList;
      break;
    case "jailed":
      selectedValidatorStatus = jailedValidatorList;
      break;
    default:
      selectedValidatorStatus = allValidatorList;
  }

  const items = [
    {
      label: `All (${allValidatorList.length})`,
      status: "",
    },
    {
      label: `Active (${activeValidatorList.length})`,
      status: "active",
    },
    {
      label: `Inactive (${inactiveValidatorList.length})`,
      status: "inactive",
    },
    {
      label: `Jailed (${jailedValidatorList.length})`,
      status: "jailed",
    },
  ];

  return (
    <>
      <div className="block md:mb-6 mb-4">
        <div className="flex container lg:max-w-5xl mx-auto max-w-md justify-start items-center md:max-w-2xl">
          <h3 className="lg:px-6 md:px-5 px-2 text-sm md:text-lg lg:text-2xl border-white text-yellow-500 font-semibold">
            Validator list
          </h3>
        </div>
        <div className="flex container lg:max-w-5xl max-w-md justify-between items-center mx-auto md:max-w-2xl lg:px-6 md:px-5 px-2 md:mt-4 mt-2">
          {/* Search Validator */}
          <div className="relative"></div>
          <ValidatorStatusFilter items={items} />
        </div>
      </div>
      <div className="container mx-auto h-full lg:max-w-5xl px-4 md:px-8 lg:px-0">
        <div className="w-full h-full lg:mb-20 md:mb-14 mb-6">
          <div className="ml-auto overflow-x-auto">
            {allValidatorList.length === 0 ? (
              <EmptyDataUI />
            ) : (
              <div className="inline-block min-w-full rounded-md bg-gray-900">
                <table className="table-auto w-full text-white">
                  <thead>
                    <tr className="md:text-sm text-xs text-yellow-500 lg:text-base">
                      <th className="font-medium text-left lg:h-16 md:h-12 h-8 lg:pl-20 md:pl-16 pl-12">
                        Validator
                      </th>
                      <th className="font-medium text-right px-3 md:px-8 lg:h-16 md:h-12 h-8">
                        Votes(%)
                      </th>
                      <th className="font-medium md:px-8 px-5 text-centerlg:h-16 md:h-12 h-8">
                        Commission
                      </th>
                      <th className="font-medium text-center lg:h-16 md:h-12 h-8">
                        APR
                      </th>
                      <th className="font-medium md:px-8 px-5 lg:h-16 md:h-12 h-8 text-right md:pr-10">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedValidatorStatus.map((validator, index) => (
                      <tr
                        key={validator.operatorAddress}
                        className={clsx(
                          "bg-gray-400 md:text-sm text-xs lg:text-base",
                          index % 2 === 0 ? "bg-opacity-10" : "bg-opacity-0",
                        )}
                      >
                        <td className="font-medium md:h-12 lg:pl-8 py-2 lg:py-4 lg:pr-5 h-12 md:pl-4 relative pr-10 md:pr-5 lg:h-20 md:py-3">
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
                        <td className="md:h-12 text-right py-2 lg:py-4 h-12 lg:h-20 md:px-8 px-3">
                          <p className="font-semibold text-right">
                            {parseNovaBalanceToLocaleStringRoundDown(
                              validator.delegatorShares,
                            )}
                            ({convertDecimalToPercentage(validator.voteShare)}
                            %)
                          </p>
                        </td>
                        <td className="md:h-12 py-2 lg:py-3 h-12 md:px-8 px-5 text-center lg:h-20">
                          <p className="font-semibold lg:w-28 mx-auto md:w-20 w-16">
                            {convertValidatorCommissionRate(
                              validator.commissionRate,
                            )}
                            %
                          </p>
                        </td>
                        <td className="relative md:h-12 py-2 h-12 lg:py-4 text-center px-5 lg:h-20">
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
                        <td className="md:h-12 py-2 h-12 lg:py-4 text-center px-5 lg:h-20 md:px-10">
                          <div className="flex items-center justify-end">
                            <EditButton
                              onClick={() => {
                                handleDelegateButtonClicked(
                                  validator.operatorAddress,
                                );
                              }}
                              disabled={!enabled}
                            />
                          </div>
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
      </div>
    </>
  );
};

export default ValidatorLists;
