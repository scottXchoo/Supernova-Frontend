import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useMyValidators from "core/hooks/validators/useMyValidators";
import { getNovaAddress } from "core/state/coreState";
import DelegationModal from "components/validators/delegate/DelegationModal";
import useDelegations from "core/hooks/validators/useDelegations";
import MyValidatorsTableRow from "./delegate/MyValidatorsTableRow";

const MyValidators = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const setOperatorAddress = useSetRecoilState(delegateOperatorAddressAtom);
  const { data: myValidatorsData, error: myValidatorsError } =
    useMyValidators(novaAddress);
  useDelegations(novaAddress);

  const setModalOpenState = useSetRecoilState(modalsAtom);

  if (!myValidatorsData || myValidatorsData.length === 0 || myValidatorsError)
    return null;

  const handleDelegateButtonClicked = (address: string) => {
    setOperatorAddress(address);
    setModalOpenState((prev) => ({
      ...prev,
      baseModal: true,
      manageMyValidator: true,
    }));
  };

  return (
    <>
      <div className="block md:mb-6 mb-4">
        <div className="flex container lg:max-w-5xl mx-auto max-w-md justify-start items-center md:max-w-2xl">
          <h3 className="lg:px-6 md:px-5 px-2 text-sm md:text-lg lg:text-2xl border-white text-yellow-500 font-semibold">
            My validators
          </h3>
        </div>
      </div>
      <div className="container mx-auto lg:max-w-5xl px-4 md:px-8 lg:px-0 md:mb-16 mb-10">
        <div className="w-full h-full lg:mb-20 md:mb-14 mb-6">
          <div className="ml-auto overflow-x-auto">
            <div className="inline-block min-w-full rounded-md bg-gray-900">
              <table className="table-auto w-full text-white">
                <thead>
                  <tr className="md:text-sm text-xs text-yellow-500 lg:text-base">
                    <th className="font-medium text-left lg:h-16 md:h-12 h-8 lg:pl-20 md:pl-16 pl-12">
                      Validator
                    </th>
                    <th className="font-medium text-right px-3 md:px-8 lg:h-16 md:h-12 h-8">
                      Staked Amount
                    </th>
                    <th className="font-medium md:px-8 px-5 text-right lg:h-16 md:h-12 h-8">
                      Claimable Rewards
                    </th>
                    <th className="font-medium md:px-8 px-5 lg:h-16 md:h-12 h-8 text-right md:pr-10 pr-5">
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myValidatorsData.map((validator, index) => (
                    <MyValidatorsTableRow
                      key={validator.operatorAddress}
                      index={index}
                      validator={validator}
                      onClick={handleDelegateButtonClicked}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DelegationModal />
        </div>
      </div>
    </>
  );
};

export default MyValidators;
