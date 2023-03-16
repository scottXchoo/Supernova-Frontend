import { Dialog, Transition } from "@headlessui/react";
import { isFullDescriptionModalOpenAtom } from "core/state/proposal/isFullDescriptionModalOpen";
import { Fragment, ReactNode } from "react";
import { useRecoilState } from "recoil";

const FullDescriptionModal = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useRecoilState(isFullDescriptionModalOpenAtom);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed h-full bottom-0 w-full bg-black bg-opacity-80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto justify-center items-center flex">
          <div className="flex flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl sm:mx-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="grid rounded-xl shadow-lg z-10 overflow-hidden md:rounded-2xl border-2 bg-white transition-all w-full">
                <div className="flex items-center justify-between w-full pt-1 md:pt-3 md:pb-3 md:px-8 px-6 pb-1.5">
                  <h3 className="text-center md:text-2xl text-lg font-bold mt-2">Description</h3>
                  <button className="outline-none" onClick={() => setIsOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-700 lg:w-9 lg:h-9 md:w-8 md:h-8 md:right-6 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="block w-full h-full items-center justify-center">
                  <div className="px-5 md:px-6 w-full">
                    <div className="flex items-start mx-auto md:px-8 lg::px-12 md:mb-8 mb-6 px-2 md:py-6 mt-2 py-4 h-[70vh] w-full overflow-y-auto overflow-x-hidden">
                      <div className="mx-auto">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default FullDescriptionModal;
