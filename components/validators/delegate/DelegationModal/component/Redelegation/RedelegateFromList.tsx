import { parseNovaBalanceToLocaleString } from "components/validators/delegate/delegateUtils";
import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import useMyValidators from "core/hooks/validators/useMyValidators";
import { getNovaAddress } from "core/state/coreState";
import { modalsAtom } from "core/state/validators/delegate/delegateModal";
import { delegationFamily } from "core/state/validators/delegate/delegation";
import { redelegateFromAddressAtom } from "core/state/validators/delegate/redelegation";
import { isMyValidatorsShownAtom } from "core/state/validators/showMyValidators";
import { APY_ZONE_NAME_NOVA } from "core/constants/constants";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { BackButton, CloseButton } from "../../common/IconButtons";
import ValidatorListTable from "./ValidatorListTable";

const RedelegateFromList = () => {
  const setIsMyValidatorsShown = useSetRecoilState(isMyValidatorsShownAtom);
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ redelegateFromList }, setIsModalOpen] = useRecoilState(modalsAtom);
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  const { data: myValidatorsData, error: myValidatorsError } =
    useMyValidators(novaAddress);
  const [selectedValidator, setSelectedValidator] = useRecoilState(
    redelegateFromAddressAtom,
  );
  const delegation = useRecoilValue(delegationFamily(selectedValidator));

  if (!redelegateFromList || !myValidatorsData || myValidatorsError)
    return null;

  const handleBackButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      redelegateFromList: false,
      manageValidator: true,
    }));
  };

  const handleSelectClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      redelegateFromList: false,
      redelegateFrom: true,
    }));
  };

  const handleValidatorClicked = (operatorAdddress: string) => {
    if (selectedValidator === operatorAdddress) {
      setSelectedValidator("");
    } else {
      setSelectedValidator(operatorAdddress);
    }
  };

  const handleOnClose = () => {
    closeAllModal();
    setSelectedValidator("");
  };

  const handleViewInMyValidatorsClicked = () => {
    setIsMyValidatorsShown(true);
    closeAllModal();
    setSelectedValidator("");
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
        <CloseButton onClick={handleOnClose} />
      </div>
      <div className="block w-full h-full items-center justify-center">
        <div className="relative md:px-8 px-5 md:py-7 py-5 md:pb-8 pb-6">
          <div className="mx-auto md:mb-4 mb-2">
            <div className="w-full mb-4">
              <h3 className="w-full text-white text-left font-semibold md:text-xl md:mb-4 mb-2 text-base">
                Choose from My Validators
              </h3>
              <div className="w-full flex justify-end">
                <button
                  onClick={handleViewInMyValidatorsClicked}
                  className="rounded-full text-white bg-blue-500 flex items-center md:py-0.5 md:px-4 px-3 py-0.5"
                >
                  <span className="text-xs font-semibold md:text-base mr-1">
                    View in My Validators page
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="inline-block min-w-full rounded-xl bg-gray-900 border border-white overflow-y-scroll h-40 md:mb-2 mb-1 lg:h-56 md:h-48">
            <ValidatorListTable
              validatorList={myValidatorsData}
              novaAPR={novaAPR}
              selectedValidator={selectedValidator}
              onClick={handleValidatorClicked}
            />
          </div>
          <div className="border-t border-white py-2 md:py-3">
            <div className="flex flex-wrap relative bg-gray-800 md:rounded-xl rounded-lg mx-auto items-center shadow-sm md:px-7 px-5 py-2.5 md:py-3 md:mb-2 mb-1">
              <div className="w-full flex items-center justify-end px-1 md:px-1.5">
                <span className="text-xs font-bold text-white md:text-sm">
                  NOVA
                </span>
              </div>
              <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
                <h3 className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm w-1/2 md:w-1/3">
                  Your delegation
                </h3>
                <div className="group grid w-1/2 md:w-2/3 justify-end">
                  <p className="font-semibold overflow-x-auto text-right text-white md:text-3xl text-xl">
                    {" "}
                    {delegation
                      ? parseNovaBalanceToLocaleString(delegation.amount)
                      : 0}
                  </p>
                </div>
              </div>
              <div className="w-full flex items-center justify-end">
                <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base">
                  ≈ $0
                </p>
              </div>
            </div>
          </div>
          <p className="text-white md:text-sm text-xs leading-tight md:leading-tight px-8 text-center md:mb-6 mb-4 md:px-6">
            Staking will lock your funds for 14days. You will need to undelegate
            in order to liquidate your staked assets and the process requires
            minimum 14days to undelegate.
          </p>
          {selectedValidator ? (
            <button
              onClick={handleSelectClicked}
              className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-white hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm text-lg bg-purple-500"
            >
              Select
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-gray-700 bg-gray-400 font-semibold shadow-sm text-lg"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default RedelegateFromList;
