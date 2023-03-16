import Modal from "components/common/Modal";
import useNovaBalance from "core/hooks/validators/useNovaBalance";
import { getNovaAddress } from "core/state/coreState";
import {
  delegateAmountAtom,
  delegateOperatorAddressAtom,
  isDelegateSuccessModalOpenAtom,
} from "core/state/validators/delegate/delegateModal";
import { validatorFamily } from "core/state/validators/validators";
import { useRecoilState, useRecoilValue } from "recoil";

const DelegateSuccessModal = () => {
  const [isOpen, setIsOpen] = useRecoilState(isDelegateSuccessModalOpenAtom);
  const [delegateAmount, setDelegateAmount] =
    useRecoilState(delegateAmountAtom);
  const novaAddress = useRecoilValue(getNovaAddress);
  const operatorAddress = useRecoilValue(delegateOperatorAddressAtom);
  const validator = useRecoilValue(validatorFamily(operatorAddress));
  const { data: novaBalance, error: novaBalanceError } =
    useNovaBalance(novaAddress);

  if (!validator || !novaBalance || novaBalanceError) return null;

  const handleOnClose = () => {
    setIsOpen(false);
    setDelegateAmount("0");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <div className="relative grid rounded-xl border-yellow-500 z-10 overflow-hidden md:rounded-2xl border-2 bg-blue-500 transition-all w-full">
        <button
          onClick={handleOnClose}
          className="absolute right-4 md:right-6 top-3 outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700 transform lg:w-9 lg:h-9 md:w-8 md:h-8 w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="block w-full h-full items-center justify-center">
          <img
            className="bg-gray-300 rounded-full mx-auto md:mt-10 mt-6 md:w-60 md:h-60 w-56 h-56"
            src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/delegate-successfully.png"
            alt=""
          />
          <div className="relative px-5 md:px-6 md:py-5 py-4">
            <div className="flex items-start mx-auto px-6 md:mb-7 mb-5">
              <div className="w-full mx-auto">
                <h3 className="text-white text-center font-semibold leading-snug md:leading-snug md:text-xl text-lg">
                  We&apos;ve successfully delegated your NOVA
                </h3>
              </div>
            </div>
            <div className="flex flex-wrap relative bg-gray-800 md:rounded-xl rounded-lg mx-auto items-center shadow-sm py-3 px-4 md:mb-7 mb-4">
              <div className="w-full flex items-center justify-end">
                <span className="text-xs font-bold text-white transform scale-90 origin-bottom-right">
                  NOVA
                </span>
              </div>
              <div className="flex items-center justify-between -mt-1 md:-mt-0.5 w-full">
                <div className="flex items-center w-1/2 relative -mx-1">
                  <div className="absolute left-0 flex items-center flex-row">
                    <img
                      className="rounded-full w-14 h-14 transform scale-90 origin-center md:h-16 md:w-16"
                      src="https://static.shuffle.dev/uploads/files/57/5730a5ae134971d53040802f2cf0497fbfee5006/val1.jpg"
                      alt=""
                    />
                    <h3 className="text-white text-left font-semibold text-sm md:text-base ml-3">
                      {validator.moniker}
                    </h3>
                  </div>
                </div>
                <div className="group grid w-1/2 justify-end right-0">
                  <p className="text-white font-semibold text-right truncate text-xl md:text-2xl">
                    {delegateAmount}
                  </p>
                  <div className="block md:h-1.5 h-1 w-12 rounded-full -mt-1.5 bg-purple-300 opacity-0 group-hover:opacity-100"></div>
                </div>
              </div>
              <div className="w-full flex items-center justify-end">
                <p className="text-gray-700 text-xs text-right mr-1 px-1 truncate">
                  ≈ $--
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>

  );
};
export default DelegateSuccessModal;
