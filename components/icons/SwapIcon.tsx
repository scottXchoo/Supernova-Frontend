import React, { useState } from "react";

type SwapButton = {
  onTokenSwaps: () => void;
  disable?: boolean;
};

export const SwapBtn = ({ onTokenSwaps, disable }: SwapButton) => {
  const [swappedPosition, setSwappedPositions] = useState(false);
  const handleButtonClicked = () => {
    if (!disable) {
      setSwappedPositions(!swappedPosition);
      onTokenSwaps();
    }
  };
  return (
    <button
      onClick={handleButtonClicked}
      className="absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center bg-gradient-to-b from-yellow-500 via-yellow-500 to-blue-500  md:p-1 p-1 w-9 h-9 -top-7 md:w-16 md:h-16 md:-top-9"
    >
      <div className="rounded-full static flex justify-center items-center group w-full h-full bg-white hover:bg-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="22"
          viewBox="0 0 15 22"
          fill="none"
          className="md:w-6 md:h-6 h-5 w-5 z-0 absolute md:top-4 md:left-4 top-3 left-3 opacity-100 md:-ml-0 -ml-0.5 group-hover:opacity-0"
          data-config-id="svg-inline11"
        >
          <path
            d="M14.5756 13.8583L13.4663 12.7489C13.3527 12.6354 13.1979 12.5683 13.038 12.5683C12.8729 12.5683 12.7232 12.6302 12.6046 12.7489L9.27131 16.0822L9.27131 1.60884C9.27131 1.27345 8.99783 0.999979 8.66245 0.999979L7.09386 0.999979C6.75847 0.999979 6.485 1.27345 6.485 1.60884L6.48499 16.0822L3.15174 12.7489C2.91439 12.5116 2.5274 12.5116 2.29005 12.7489L1.18068 13.8583C1.06717 13.9718 1.00009 14.1266 1.00009 14.2917C1.00009 14.4568 1.06201 14.6065 1.18068 14.7251L7.09901 20.6435C7.31573 20.8602 7.59436 20.9634 7.87815 20.9634C8.16194 20.9634 8.44057 20.855 8.65728 20.6435L14.5808 14.72C14.8181 14.4826 14.8181 14.0956 14.5808 13.8583L14.5756 13.8583Z"
            fill="#191919"
            stroke="#191919"
            strokeWidth="0.3"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="27"
          viewBox="0 0 26 27"
          fill="none"
          className="md:w-6 md:h-6 h-5 w-5 z-10 absolute md:top-4 md:left-4 top-3 left-3 opacity-0 group-hover:opacity-100"
          data-config-id="svg-inline12"
        >
          <path
            d="M12.4245 7.42343L13.5338 8.53279C13.6474 8.64631 13.8022 8.71339 13.9621 8.71339C14.1272 8.71339 14.2769 8.65147 14.3955 8.53279L17.7288 5.19954L17.7288 19.6729C17.7288 20.0083 18.0023 20.2817 18.3376 20.2817L19.9062 20.2817C20.2416 20.2817 20.5151 20.0083 20.5151 19.6729L20.5151 5.19954L23.8483 8.53279C24.0857 8.77015 24.4727 8.77015 24.71 8.53279L25.8194 7.42343C25.9329 7.30991 26 7.15512 26 6.99001C26 6.82489 25.9381 6.67526 25.8194 6.55658L19.8959 0.633089C19.6792 0.416375 19.4006 0.313177 19.1168 0.313177C18.833 0.313177 18.5544 0.421535 18.3376 0.633088L12.4142 6.55658C12.1768 6.79393 12.1768 7.18092 12.4142 7.41827L12.4245 7.42343Z"
            fill="url(#paint0_linear_1363_5603)"
          ></path>
          <path
            d="M13.5755 19.8949L12.4662 18.7855C12.3526 18.672 12.1978 18.6049 12.0379 18.6049C11.8728 18.6049 11.7231 18.6669 11.6045 18.7855L8.27121 22.1188L8.27121 7.64546C8.27121 7.31007 7.99774 7.0366 7.66235 7.0366L6.09376 7.0366C5.75837 7.0366 5.4849 7.31007 5.4849 7.64546L5.4849 22.1188L2.15165 18.7855C1.9143 18.5482 1.52731 18.5482 1.28996 18.7855L0.180592 19.8949C0.0670761 20.0084 -2.97743e-06 20.1632 -2.99186e-06 20.3283C-3.0063e-06 20.4934 0.0619162 20.6431 0.180592 20.7618L6.09892 26.6801C6.31563 26.8968 6.59427 27 6.87806 27C7.16185 27 7.44048 26.8916 7.65719 26.6801L13.5807 20.7566C13.818 20.5192 13.818 20.1323 13.5807 19.8949L13.5755 19.8949Z"
            fill="url(#paint1_linear_1363_5603)"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_1363_5603"
              x1="26"
              y1="26.2565"
              x2="26"
              y2="0.363366"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.13" stopColor="#3838F4"></stop>
              <stop offset="0.36" stopColor="#8B7FFF"></stop>
              <stop offset="0.69" stopColor="#E6FF67"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_1363_5603"
              x1="13.7587"
              y1="32.9732"
              x2="13.7587"
              y2="7.08678"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.13" stopColor="#3838F4"></stop>
              <stop offset="0.36" stopColor="#8B7FFF"></stop>
              <stop offset="0.69" stopColor="#E6FF67"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </button>
  );
};

export const LiquidityAddBtn = () => {
  return (
    <div className="absolute md:-top-8 -top-5  left-1/2 -translate-x-1/2 md:w-12 md:h-12 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-b from-yellow-500 via-yellow-500 to-blue-500 p-0.5">
      <div className="rounded-full flex justify-center p-2 items-center w-full h-full bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="md:w-5 md:h-5 h-4 w-4"
          data-config-id="svg-inline13"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.7766 20C11.1632 20 11.4766 19.6866 11.4766 19.3L11.4766 11.4768H19.3C19.6866 11.4768 20 11.1634 20 10.7768V9.22322C20 8.83662 19.6866 8.52322 19.3 8.52322H11.4766L11.4766 0.7C11.4766 0.313401 11.1632 0 10.7766 0H9.22297C8.83638 0 8.52297 0.313401 8.52297 0.7L8.52297 8.52322H0.7C0.313401 8.52322 0 8.83662 0 9.22322V10.7768C0 11.1634 0.313401 11.4768 0.700001 11.4768H8.52297L8.52297 19.3C8.52297 19.6866 8.83637 20 9.22297 20H10.7766Z"
            fill="#191919"
          ></path>
        </svg>
      </div>
    </div>
  );
};
