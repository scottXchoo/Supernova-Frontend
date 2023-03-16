import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

export default function ChainAlert() {
  const showChainAlert = process.env.NEXT_PUBLIC_CHAIN_ALERT || false;
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (typeof showChainAlert === "string") {
      setIsOpen(showChainAlert === "false" ? false : true);
    } else {
      setIsOpen(false);
    }
  }, [showChainAlert]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-red-500"
                  >
                    NOTICE 📢
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-md text-gray-900 leading-snug">
                      We are solving some problem that comes from massive
                      traffic. Please visit our{" "}
                      <a
                        href="https://discord.com/invite/2gj8fScWqD"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-blue-500 underline outline-none"
                      >
                        Discord
                      </a>{" "}
                      to be notified.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-lg border border-transparent bg-black px-4 py-4 text-xl font-semibold text-yellow-500 hover:bg-gray-800 outline-none"
                      onClick={closeModal}
                    >
                      Got it!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
