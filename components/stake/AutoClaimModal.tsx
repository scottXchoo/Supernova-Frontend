import Big from "big.js";
import { isAutoClaimModalOpen } from "core/state/autoClaim";
import { SNASSET_DECIMAL } from "core/utils/constants";
import { trimTrailingZeros } from "core/utils/numberFormatter";
import { useSetRecoilState } from "recoil";

type AutoClaimModalProps = {
  assetDisplayDenom: string;
  snAssetDisplayDenom: string;
  stakedAmount: Big;
  lazyMintingTime: string;
  autoClaimedTime: string;
  estimatedRatio: Big;
};

export const AutoClaimModal = ({
  assetDisplayDenom,
  snAssetDisplayDenom,
  stakedAmount,
  lazyMintingTime,
  autoClaimedTime,
  estimatedRatio,
}: AutoClaimModalProps) => {
  const setIsModalOpen = useSetRecoilState(isAutoClaimModalOpen);
  if (!isAutoClaimModalOpen) return null;

  const handleBackButtonClicked = () => {
    setIsModalOpen(false);
  };
  const estimatedStakedAmount = stakedAmount.mul(estimatedRatio);
  const parsedEstimatedStakedAmount = trimTrailingZeros(
    estimatedStakedAmount.toFixed(SNASSET_DECIMAL, Big.roundDown),
  );

  return (
    <div className="flex flex-wrap items-center mt-8 md:mx-auto mx-7 justify-center rounded-3xl sm:mx-auto w-112">
      <div className="grid rounded-xl ease-in-out duration-300 z-10 bg-black border-purple-300 border-2 w-full">
        <div className="flex items-center justify-between w-full border-b-2 md:pt-4 md:pb-3 pt-2 pb-2 md:px-6 px-4 border-purple-300">
          <div className="flex items-center">
            <h3 className="text-center md:text-2xl text-lg font-bold text-purple-300">
              Stake Details
            </h3>
          </div>
          <button onClick={handleBackButtonClicked}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="block w-full h-full items-center justify-center md:px-6 px-4 md:py-6 py-4">
          <p className="text-white font-medium tracking-tight md:text-base leading-snug md:leading-snug md:mb-7 mb-5 text-xs px-2 text-center md:text-left md:px-3">
            Your staked {assetDisplayDenom} will be auto-claimed as{" "}
            {snAssetDisplayDenom} to your wallet in every 15 minutes. Check more
            about{" "}
            <a
              className="text-white hover:text-yellow-500 font-semibold"
              href="#"
            >
              Supernova’s lazy minting process.
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="inline-block md:h-5 md:w-5 h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                ></path>
              </svg>
            </a>
          </p>
          <nav aria-label="Progress" className="">
            <ol
              role="list"
              className="overflow-hidden mb-6 grid md:mb-8 justify-center"
            >
              <li className="relative pb-8">
                <div
                  className="-ml-px absolute mt-0.5 top-4 md:w-2 w-1.5 h-full bg-yellow-500 left-3.5"
                  aria-hidden="true"
                ></div>
                <div className="relative flex items-start">
                  <span className="h-9 flex items-center">
                    <span className="relative z-10 md:w-8 md:h-8 w-7 h-7 flex items-center justify-center bg-yellow-500 rounded-full text-black md:text-base text-sm">
                      1
                    </span>
                  </span>
                  <span className="min-w-0 flex flex-col text-white md:mt-0 mt-1.5 ml-4 md:ml-6">
                    <span className="text-sm font-bold md:text-lg">
                      Stake order submitted
                    </span>
                  </span>
                </div>
              </li>
              <li className="relative pb-8">
                <div className="-ml-px absolute mt-0.5 top-4 md:w-2 w-1.5 h-full grid place-content-center left-3.5 bg-gray-200">
                  <div className="absolute top-0 left-0 md:w-2 w-1.5 h-1/2 bg-purple-300"></div>
                </div>
                <div className="relative flex group items-center">
                  <span className="relative z-10 md:w-8 md:h-8 w-7 h-7 flex items-center justify-center bg-purple-300 rounded-full text-black md:text-base text-sm">
                    2
                  </span>
                  <span className="min-w-0 flex flex-col text-white md:ml-6 ml-4">
                    <span className="text-sm font-bold md:text-lg">
                      Lazy minting processing
                    </span>
                    <span className="md:text-sm text-xs">
                      {lazyMintingTime}
                    </span>
                  </span>
                </div>
              </li>
              <li className="relative">
                <div className="relative flex items-start group">
                  <span className="relative z-10 md:w-8 md:h-8 w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 text-black md:text-base text-sm">
                    3
                  </span>
                  <span className="md:ml-6 ml-4 min-w-0 flex flex-col text-gray-700">
                    <span className="text-sm font-bold md:text-lg">
                      {snAssetDisplayDenom} auto-claimed
                    </span>
                    <span className="md:text-sm text-xs">
                      Est. {autoClaimedTime}
                    </span>
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="block w-full border-2 md:rounded-2xl rounded-lg mx-auto md:px-6 px-3 shadow-sm bg-gray-100 border-gray-200 py-2 md:py-2.5">
            <div className="w-full flex justify-between items-center md:mb-2 mb-1">
              <p className="font-bold text-left md:text-base text-xs text-purple-300">
                Staked Amount
              </p>
              <p className="md:text-base text-xs text-right text-gray-700 font-medium">
                Est. {autoClaimedTime}
              </p>
            </div>
            <div className="flex w-full items-center">
              <div className="group">
                <p className="text-gray-700 font-semibold number-scroll-purple max-w-sm md:text-3xl text-2xl">
                  {stakedAmount.toString()}
                </p>
              </div>
              <span className="md:text-2xl text-left font-semibold text-gray-700 ml-1 md:ml-2">
                {assetDisplayDenom}
              </span>
            </div>
            <div className="flex w-full items-center">
              <div className="group">
                <p className="text-purple-300 font-semibold number-scroll-purple md:text-2xl text-xl max-w-xs">
                  ≈{parsedEstimatedStakedAmount}
                </p>
              </div>
              <span className="text-left font-semibold text-purple-300 ml-1 md:ml-1.5 md:text-xl">
                {snAssetDisplayDenom}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
