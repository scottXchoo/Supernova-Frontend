import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Image from "next/image";

type ConnectWalletModalProps = {
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (values: boolean) => void;
  connectWallet: () => Promise<void>;
};
export default function ConnectWalletModal({
  open,
  setOpen,
  connectWallet,
}: ConnectWalletModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
        </Transition.Child>
        <div className="fixed z-11 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100  sm:scale-100"
              leaveTo="opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-blue-default rounded px-11 pt-7 pb-16 text-left shadow-xl transform transition-all">
                <div className="flex flex-row justify-between items-center">
                  <div className="text-24 font-semibold">Connect Wallet</div>
                  <button
                    type="button"
                    className="rounded-md text-white focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <XIcon className="h-8 w-8" aria-hidden="true" />
                  </button>
                </div>
                <div
                  onClick={connectWallet}
                  className="w-[550px] h-[150px] mt-12 p-7 bg-white border-yellow-default border-solid border-2 rounded flex flex-row justify-start"
                >
                  <Image src={"./keplr.png"} alt={""} width={90} height={90} />
                  <div className="flex flex-col justify-center items-start ml-7 text-black text-30 font-semibold leading-8">
                    Connect Keplr
                    <div className=" text-20 font-medium">www.keplr.app</div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
