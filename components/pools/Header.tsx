import { PairInfo } from "core/config/pairInfo";
import React from "react";

const Header = ({ pair }: { pair: PairInfo }) => {
  return (
    <div className="grid grid-cols-7 self-center bg-black md:rounded-t-2xl rounded-t-lg px-4 items-center md:py-5 py-3 md:px-8 mb-1">
      <div className="flex-initial md:col-span-5 col-span-6">
        <div className="flex items-center">
          <img
            alt=""
            src={`/${pair.asset0.img}`}
            className="bg-gray-300 rounded-full h-7 w-7 md:mr-1 mr-0.5 md:w-11 md:h-11 xl:w-7 xl:h-7 xl:mr-0.5"
          />
          <img
            alt=""
            src={`/${pair.asset1.img}`}
            className="bg-gray-300 rounded-full md:mr-4 w-7 h-7 mr-1.5 md:w-11 md:h-11 xl:w-7 xl:h-7 xl:mr-1.5"
          />
          <h3 className="text-white text-left font-semibold md:text-3xl text-xl xl:text-2xl">
            {pair.asset0.denom}/{pair.asset1.denom}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Header;
