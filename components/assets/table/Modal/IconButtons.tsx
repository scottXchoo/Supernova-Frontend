import clsx from "clsx";

export const Arrow = ({ isUp }: { isUp?: boolean }) => {
  return (
    <div className="absolute rounded-full flex items-center justify-center bg-gradient-to-b from-yellow-500 via-yellow-500 to-blue-500 md:p-1 w-9 h-9 -top-7 md:w-16 md:h-16 left-1/2 transform -translate-x-1/2 p-1 md:-top-9 md:mt-1">
      <a className="rounded-full static flex justify-center items-center group w-full h-full bg-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="22"
          viewBox="0 0 15 22"
          fill="none"
          className={clsx(
            "md:w-6 md:h-6 h-5 w-5 z-0 absolute md:top-4 md:left-4 top-3 left-3 opacity-100 md:-ml-0 -ml-0.5",
            { " transform rotate-180": isUp },
          )}
        >
          <path
            d="M14.5756 13.8583L13.4663 12.7489C13.3527 12.6354 13.1979 12.5683 13.038 12.5683C12.8729 12.5683 12.7232 12.6302 12.6046 12.7489L9.27131 16.0822L9.27131 1.60884C9.27131 1.27345 8.99783 0.999979 8.66245 0.999979L7.09386 0.999979C6.75847 0.999979 6.485 1.27345 6.485 1.60884L6.48499 16.0822L3.15174 12.7489C2.91439 12.5116 2.5274 12.5116 2.29005 12.7489L1.18068 13.8583C1.06717 13.9718 1.00009 14.1266 1.00009 14.2917C1.00009 14.4568 1.06201 14.6065 1.18068 14.7251L7.09901 20.6435C7.31573 20.8602 7.59436 20.9634 7.87815 20.9634C8.16194 20.9634 8.44057 20.855 8.65728 20.6435L14.5808 14.72C14.8181 14.4826 14.8181 14.0956 14.5808 13.8583L14.5756 13.8583Z"
            fill="#191919"
            stroke="#191919"
            strokeWidth="0.3"
          />
        </svg>
      </a>
    </div>
  );
};
