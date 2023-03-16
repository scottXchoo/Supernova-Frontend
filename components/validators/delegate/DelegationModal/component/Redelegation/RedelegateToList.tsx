import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import useValidators from "core/hooks/validators/useValidators";
import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { redelegateToAddressAtom } from "core/state/validators/delegate/redelegation";
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

const RedelegateToList = () => {
  const setIsMyValidatorsShown = useSetRecoilState(isMyValidatorsShownAtom);
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ redelegateToList }, setIsModalOpen] = useRecoilState(modalsAtom);
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  const { data: validatorsData, error: validatorsError } = useValidators();
  const modalValidatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const [selectedValidator, setSelectedValidator] = useRecoilState(
    redelegateToAddressAtom,
  );
  if (!redelegateToList || !validatorsData || validatorsError) return null;

  const handleBackButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      redelegateToList: false,
      manageMyValidator: true,
    }));
  };

  const handleSelectClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      redelegateToList: false,
      redelegateTo: true,
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

  const handleSeeAllValidatorsClicked = () => {
    setIsMyValidatorsShown(false);
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
                Choose the validator to redelegate
              </h3>
              <div className="w-full flex justify-end">
                <button
                  onClick={handleSeeAllValidatorsClicked}
                  className="rounded-full text-white bg-blue-500 flex items-center md:py-0.5 md:px-4 px-3 py-0.5"
                >
                  <span className="text-xs font-semibold md:text-base mr-1">
                    See all the validators
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="inline-block min-w-full rounded-xl bg-gray-900 border border-white h-60 overflow-y-scroll md:h-72 lg:h-80 md:mb-7 mb-4">
            <ValidatorListTable
              validatorList={validatorsData.filter(
                (validator) =>
                  validator.operatorAddress !== modalValidatorAddress,
              )}
              novaAPR={novaAPR}
              selectedValidator={selectedValidator}
              onClick={handleValidatorClicked}
            />
          </div>
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
export default RedelegateToList;
