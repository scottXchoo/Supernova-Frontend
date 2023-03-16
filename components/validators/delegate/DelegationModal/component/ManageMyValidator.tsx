import {
  delegateOperatorAddressAtom,
  modalsAtom,
} from "core/state/validators/delegate/delegateModal";
import { delegationFamily } from "core/state/validators/delegate/delegation";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleString,
} from "../../delegateUtils";
import ValidatorInfo from "../common/ValidatorInfo";

const ManageMyValidator = () => {
  const closeAllModal = useResetRecoilState(modalsAtom);
  const [{ manageMyValidator }, setIsModalOpen] = useRecoilState(modalsAtom);
  const operatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const delegation = useRecoilValue(delegationFamily(operatorAddress));

  if (!manageMyValidator || !delegation) return null;
  const handleModalOnClose = () => {
    closeAllModal();
  };

  const handleRedelegateButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      manageMyValidator: false,
      redelegateToList: true,
    }));
  };
  const handleUndelegateButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      manageMyValidator: false,
      undelegate: true,
    }));
  };
  const handleAddDelegateButtonClicked = () => {
    setIsModalOpen((prev) => ({
      ...prev,
      manageMyValidator: false,
      addDelegate: true,
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between w-full pt-1 bg-black relative md:pt-3 md:pb-3 border-b border-yellow-500 md:px-7 px-5 pb-1.5">
        <div className="flex items-center text-yellow-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="20"
            viewBox="0 0 28 20"
            fill="currentColor"
            className="lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6"
          >
            <path
              d="M7 2.94453C7 3.75764 6.34084 4.4168 5.52773 4.4168H1.47227C0.659156 4.4168 0 3.75764 0 2.94453C0 2.13142 0.659156 1.47227 1.47227 1.47227H5.52773C6.34084 1.47227 7 2.13142 7 2.94453ZM7 10.3059C7 9.49275 6.34084 8.83359 5.52773 8.83359H1.47227C0.659156 8.83359 0 9.49275 0 10.3059C0 11.119 0.659156 11.7781 1.47227 11.7781H5.52773C6.34084 11.7781 7 11.119 7 10.3059ZM27.0633 18.0486C26.499 18.642 25.553 18.642 24.9887 18.0486L23.0623 16.0228C21.6799 14.569 19.4306 14.5012 17.4335 14.6925C17.225 14.7124 17.0138 14.7227 16.8 14.7227C12.936 14.7227 9.8 11.4248 9.8 7.36133C9.8 3.29787 12.936 0 16.8 0C20.664 0 23.8 3.29787 23.8 7.36133C23.8 7.6204 23.7871 7.87597 23.762 8.12751C23.5572 10.178 23.6288 12.4547 25.0469 13.9499L27.0646 16.0773C27.5888 16.63 27.5883 17.4966 27.0633 18.0486ZM21 7.36133C21 4.93209 19.11 2.94453 16.8 2.94453C14.49 2.94453 12.6 4.93209 12.6 7.36133C12.6 9.79056 14.49 11.7781 16.8 11.7781C19.11 11.7781 21 9.79056 21 7.36133ZM0 17.6672C0 18.4803 0.659156 19.1395 1.47227 19.1395H12.5277C13.3408 19.1395 14 18.4803 14 17.6672C14 16.8541 13.3408 16.1949 12.5277 16.1949H1.47227C0.659156 16.1949 0 16.8541 0 17.6672Z"
              fill="currentColor"
            />
          </svg>
          <h3 className="text-center md:text-2xl text-lg font-bold ml-2">
            Manage My Validator
          </h3>
        </div>
        <button
          onClick={handleModalOnClose}
          className="absolute md:top-4 md:right-4 top-2 right-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-white md:w-7 md:h-7 w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="block w-full h-full items-center justify-center">
        <div className="relative md:px-8 py-6 px-5 md:py-7">
          <div className="flex items-start mx-auto border-b border-white mb-5 md:mb-6 md:pb-8 pb-5">
            <ValidatorInfo operatorAddress={operatorAddress} />
          </div>
          <div className="flex flex-wrap relative bg-gray-800 md:rounded-xl rounded-lg mx-auto items-center px-3 shadow-sm md:mb-2 mb-1 md:px-7 px-5 py-2.5 md:py-3">
            <div className="w-full flex items-center justify-end px-1 md:px-1.5">
              <span className="text-xs font-bold text-white md:text-sm">
                NOVA
              </span>
            </div>
            <div className="flex w-full items-center justify-between -mt-1 md:-mt-0.5">
              <h3 className="text-purple-500 text-left font-semibold -mt-0.5 md:text-lg text-sm w-1/2 md:w-1/3">
                Your delegation
              </h3>
              <div className="group w-1/2 justify-end grid md:w-2/3">
                <p className="font-semibold overflow-x-auto text-right text-white md:text-3xl text-xl">
                  {parseNovaBalanceToLocaleString(delegation.amount)}
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate md:text-base">
                ≈ ${DEFAULT_NUMBER_STRING}
              </p>
            </div>
          </div>
          <div className="w-full flex items-center space-x-2 md:mt-5 mt-4">
            <div className="w-1/2">
              <button
                onClick={handleUndelegateButtonClicked}
                className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-white bg-black hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm text-lg bg-transparent ring-2 ring-inset ring-white"
              >
                Undelegate
              </button>
            </div>
            <div className="w-1/2">
              <button
                onClick={handleRedelegateButtonClicked}
                className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-white hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm text-lg bg-purple-500"
              >
                Redelegate
              </button>
            </div>
          </div>
          <div
            onClick={handleAddDelegateButtonClicked}
            className="md:mt-3 mt-2"
          >
            <button className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-white bg-black hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm text-lg bg-blue-500">
              Add Delegate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ManageMyValidator;
