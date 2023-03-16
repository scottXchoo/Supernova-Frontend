import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, useState } from "react";

export type StakeModalInprogressProgress = {
  amount: string;
  estimatedAmount: string;
  inputDenom: string;
  estimatedDenom: string;
  unstake?: boolean;
};
export const StakeModalInprogress = ({
  amount,
  estimatedAmount,
  inputDenom,
  estimatedDenom,
  unstake,
}: StakeModalInprogressProgress) => (
  <div className="fixed h-full bottom-0 left-0 w-full z-40 bg-black bg-opacity-80 justify-center items-center flex">
    <div className="flex max-w-lg flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl">
      <div className="bg-white grid rounded-xl border-2 border-yellow-500 ease-in-out duration-300 z-10 md:px-8 md:py-6 py-4 px-4">
        <div className="relative">
          <img
            className="mx-auto border border-white rounded-full md:h-40 md:w-40 md:mb-4 h-32 w-32 mb-4 md:mt-0 mt-1"
            src="logo_graphic.png"
            alt=""
          />
          <img
            className="mx-auto border border-white rounded-full md:h-40 md:w-40 md:mb-4 h-32 w-32 mb-4 md:mt-0 mt-1 z-10 top-0 absolute inset-0 animate-spin"
            src="progress_graphic.png"
            alt=""
          />
          <h3 className="md:text-2xl text-black font-bold text-center mb-2 text-lg md:px-0 leading-tight md:mb-3">
            {" "}
            You are now {unstake ? "unstaking" : "staking"} {amount}{" "}
            {inputDenom}
          </h3>
          <p className="md:text-lg text-black font-medium text-center text-xs mb-3 leading-tight md:leading-tight md:mb-5 md:px-8 px-6">
            Upon approval you will receive approximately
            <br /> {estimatedAmount} {estimatedDenom}.
          </p>
          <div className="border-t-2 border-yellow-500 md:pt-5 pt-3">
            <p className="md:text-lg text-blue-500 font-medium text-center text-xs">
              Confirm this transaction in your wallet!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export type StakeModalCompletedAutoProps = {
  snDenom: string;
};
export const StakeModalCompletedAuto = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Transition show={isOpen} as={Fragment}>
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
          <div className="flex flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl sm:mx-auto md:max-w-lg max-w-md w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex max-w-lg flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl w-full">
                <div className="bg-white grid rounded-xl border-2 border-yellow-500 ease-in-out duration-300 z-10 md:px-8 md:py-6 py-4 px-4">
                  <div className="relative">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute right-0 top-0 outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="lg:w-9 lg:h-9 md:w-8 md:h-8 md:right-6 w-6 h-6 text-gray-700"
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
                    <img
                      className="mx-auto border border-white rounded-full md:h-40 md:w-40 md:mb-4 h-32 w-32 mb-4 md:mt-0 mt-1"
                      src="completed.png"
                      alt=""
                    />
                    <h3 className="md:text-2xl text-black font-bold text-center mb-2 text-lg md:px-0 leading-tight md:mb-3">
                      Transaction is confirmed!{" "}
                    </h3>
                    <p className="md:text-lg text-black font-medium text-center text-xs mb-3 leading-tight md:leading-tight md:mb-5 md:px-16 md:mx-6 px-10 mx-4">
                      After 10-20 seconds, the staked amount below will be updated.
                    </p>
                    <div className="md:pt-8 pt-5">
                      <button className="inline-block w-full py-3 px-4 text-center md:rounded-xl rounded-lg font-semibold transform duration-200 shadow-sm text-gray-700 bg-gray-400 text-lg md:text-xl md:py-4 md:text-2xl relative flex items-center justify-center">
                        <span className="text-center md:text-2xl text-gray-700  font-semibold  text-lg">
                          In progress
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          className="animate-spin ml-2 md:w-6 md:h-6 h-4 w-4"
                        >
                          <circle
                            cx="15"
                            cy="15"
                            r="13.25"
                            stroke="#D9D9D9"
                            strokeWidth="3.5"
                          ></circle>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30V26.5C8.64873 26.5 3.5 21.3513 3.5 15C3.5 8.64873 8.64873 3.5 15 3.5V0Z"
                            fill="#AAAAFF"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  );
};
export type StakeModalCompletedProps = {
  onClick?: () => void;
};

export const StakeModalCompleted = ({ onClick }: StakeModalCompletedProps) => {
  return (
    <div className="fixed h-full bottom-0 left-0 w-full z-40 bg-black bg-opacity-80 justify-center items-center flex">
      <div className="flex max-w-lg flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl">
        <div className="bg-white grid rounded-xl border-2 border-yellow-500 ease-in-out duration-300 z-10 md:px-8 md:py-6 py-4 px-4">
          <div className="relative">
            <img
              className="mx-auto border border-white rounded-full md:h-40 md:w-40 md:mb-4 h-32 w-32 mb-4 md:mt-0 mt-1"
              src="completed.png"
              alt=""
            />
            <h3 className="md:text-2xl text-black font-bold text-center mb-2 text-lg md:px-0 leading-tight md:mb-3">
              Transaction is confirmed!{" "}
            </h3>
            <p className="md:text-lg text-black font-medium text-center text-xs mb-3 leading-tight md:leading-tight md:mb-5 md:px-16 md:mx-6 px-10 mx-4">
              After a few seconds, the unstaked amount in the claim tab will be
              updated.
            </p>
            <div className="md:pt-8 pt-5">
              <Link href={"/claim"}>
                <button
                  onClick={onClick}
                  className="inline-block w-full py-3 px-4 text-center md:rounded-xl rounded-lg font-semibold transform duration-200 shadow-sm text-white bg-black text-lg md:text-xl md:py-4 md:text-2xl relative flex items-center justify-center"
                >
                  <span className="text-center md:text-2xl text-yellow-500  font-semibold  text-lg">
                    Claim
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
