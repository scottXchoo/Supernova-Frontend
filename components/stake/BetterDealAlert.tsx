import Big from "big.js";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export type BetterDealAlertProps = {
  isBetterOnSwap: boolean;
  snDenomPretty: string;
  estimatedRatio: Big;
  swapEstimatedRatio: Big;
};
export const BetterDealAlert = ({
  isBetterOnSwap,
  snDenomPretty,
  estimatedRatio,
  swapEstimatedRatio,
}: BetterDealAlertProps) => {
  const [showAlert, setShowAlert] = useState(isBetterOnSwap);
  const onCloseButtonClicked = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    setShowAlert(isBetterOnSwap);
  }, [isBetterOnSwap, snDenomPretty]);
  return showAlert ? (
    <div className="fixed h-full bottom-0 left-0  w-full z-40 bg-black bg-opacity-80 justify-center items-center flex">
      <div className="flex max-w-lg flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl">
        <div className="bg-white grid rounded-xl border-2 border-yellow-500 ease-in-out duration-300 z-10">
          <div className="flex items-center bg-black w-full border-b-2 text-white border-yellow-500 rounded-t-xl md:pt-2 md:pb-2 pt-2 pb-2 md:px-6 px-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="27"
              viewBox="0 0 26 27"
              fill="none"
              className="w-4 h-auto md:w-6"
            >
              <path
                d="M12.4245 7.10995L13.5338 8.21932C13.6474 8.33283 13.8022 8.39991 13.9621 8.39991C14.1272 8.39991 14.2769 8.33799 14.3955 8.21932L17.7288 4.88606L17.7288 19.3594C17.7288 19.6948 18.0023 19.9683 18.3376 19.9683L19.9062 19.9683C20.2416 19.9683 20.5151 19.6948 20.5151 19.3594L20.5151 4.88607L23.8483 8.21932C24.0857 8.45667 24.4727 8.45667 24.71 8.21932L25.8194 7.10995C25.9329 6.99644 26 6.84164 26 6.67653C26 6.51141 25.9381 6.36178 25.8194 6.2431L19.8959 0.319612C19.6792 0.102899 19.4006 -0.000300031 19.1168 -0.000300055C18.833 -0.00030008 18.5544 0.108058 18.3376 0.319612L12.4142 6.2431C12.1768 6.48045 12.1768 6.86744 12.4142 7.10479L12.4245 7.10995Z"
                fill="white"
              />
              <path
                d="M13.5756 19.5814L12.4663 18.4721C12.3527 18.3585 12.1979 18.2915 12.038 18.2915C11.8729 18.2915 11.7232 18.3534 11.6046 18.4721L8.27131 21.8053L8.27131 7.33198C8.27131 6.99659 7.99783 6.72312 7.66245 6.72312L6.09386 6.72312C5.75847 6.72312 5.48499 6.99659 5.48499 7.33198L5.48499 21.8053L2.15174 18.4721C1.91439 18.2347 1.5274 18.2347 1.29005 18.4721L0.180684 19.5814C0.0671679 19.6949 8.83357e-05 19.8497 8.83213e-05 20.0149C8.83069e-05 20.18 0.0620075 20.3296 0.180684 20.4483L6.09901 26.3666C6.31573 26.5833 6.59436 26.6865 6.87815 26.6865C7.16194 26.6865 7.44057 26.5782 7.65728 26.3666L13.5808 20.4431C13.8181 20.2058 13.8181 19.8188 13.5808 19.5814L13.5756 19.5814Z"
                fill="white"
              />
            </svg>
            <h3 className="text-center md:text-2xl text-lg font-bold md:ml-5 ml-3">
              {" "}
              Better deal on Swap!
            </h3>
          </div>
          <div className="md:p-5 p-4">
            <p className="md:text-lg font-medium text-sm mx-auto tracking-tight">
              You can get a{" "}
              <span className="inline-block w-fit text-blue-500 font-bold md:text-lg text-sm">
                {estimatedRatio
                  .minus(swapEstimatedRatio)
                  .div(estimatedRatio)
                  .mul(100)
                  .toFixed(3)}
                %
              </span>
              &nbsp;discount by buying {snDenomPretty} on{" "}
              <span className="inline-block w-fit text-blue-500 font-bold md:text-lg text-sm">
                Swap
              </span>
              rather than staking directly.
            </p>
            <Link href={"/swap"}>
              <p className="inline-block w-full md:mt-5 mt-4  md:mb-2 mb-1.5 md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-xl rounded-md text-white bg-blue-500 hover:bg-opacity-80 font-semibold shadow-sm cursor-pointer">
                Go to Swap
              </p>
            </Link>
            <button
              onClick={onCloseButtonClicked}
              className="inline-block w-full md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-xl rounded-md text-white bg-gray-700 font-semibold hover:bg-opacity-80 shadow-sm"
            >
              Close and proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};
