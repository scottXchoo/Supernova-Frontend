import React from "react";
import * as gtag from "lib/gtag";
import { useRouter } from "next/router";
import Image from "next/image";
import { PairInfo } from "core/config/pairInfo";
import { ButtonStatus } from "components/common/Button";
import { ClickHandler } from "components/common/Button/StateButton";

// [TODO]: Replace Liqudity Add Components
export const Button = ({ pair }: { pair: PairInfo }) => {
  const router = useRouter();
  const clickLiquidityState = (
    e: React.MouseEvent<HTMLButtonElement>,
    link: string,
  ) => {
    e.preventDefault();
    router.push(link);
    gtag.event({
      action: "click-manage-liquidity",
      category: "liquidity",
    });
  };

  return (
    <button
      className="inline-block w-full md:mt-3 mt-2 md:py-3 py-2 px-4 md:mb-3 mb-2 text-center md:text-2xl md:rounded-xl rounded-lg text-yellow-500 bg-black hover:bg-gray-800 font-semibold transform duration-200 shadow-sm text-lg xl:text-xl"
      onClick={(e) =>
        clickLiquidityState(
          e,
          `liquidity/add/${pair.asset0.denom}?snDenom=${pair.asset1.denom}`,
        )
      }
    >
      Add liquidity
    </button>
  );
};

export type StakeLpButtonProps = {
  onClick?: ClickHandler;
};

export type ActiveButtonProps = {
  onClick?: ClickHandler;
  content: string;
};

export type InActivateButtonProps = {
  content: string;
};

export type LoadingButtonProps = {
  content: string;
};

export const ConfirmButton = ({ onClick, content }: ActiveButtonProps) => {
  return (
    <button
      className="inline-block w-full text-center md:text-2xl md:rounded-xl rounded-lg bg-black font-semibold transform duration-200 shadow-sm text-lg px-2 xl:text-xl py-2 text-white md:py-4 hover:bg-gray-800 opacity-100 hover:opacity-90"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export const ActiveButton = ({ onClick, content }: ActiveButtonProps) => {
  return (
    <button
      className="inline-block w-full text-center md:text-2xl md:rounded-xl rounded-lg bg-black font-semibold transform duration-200 shadow-sm text-lg px-2 xl:text-xl py-2 text-white md:py-4 hover:bg-gray-800 opacity-100 hover:opacity-90"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export const LoadingButton = ({ content }: LoadingButtonProps) => {
  return (
    <button className="flex flex-row w-full md:py-4 py-2 px-2 text-center items-center justify-center md:rounded-xl rounded-lg text-gray-400 bg-black font-semibold transform duration-200 shadow-sm text-lg xl:text-xl">
      {content}
      <div className="h-full ml-4 flex items-center animate-spin">
        <Image src={"loading.png"} width={20} height={20} alt={""} />
      </div>
    </button>
  );
};

export const InActivateButton = ({ content }: InActivateButtonProps) => {
  return (
    <button className="inline-block w-full text-center md:text-2xl md:rounded-xl rounded-lg bg-gray-700 text-gray-400 font-semibold cursor-not-allowed shadow-sm text-lg px-2 xl:text-xl py-2 md:py-4">
      {content}
    </button>
  );
};

export const PlusButton = ({ onClick }: StakeLpButtonProps) => {
  return (
    <button
      className="w-1/2 text-center md:rounded-xl rounded-lg bg-black hover:bg-gray-800 font-medium duration-200 shadow-sm px-2 text-white transition flex justify-center items-center md:py-4 opacity-100 hover:opacity-90 py-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
        className="md:h-7 h-6"
        data-config-id="svg-inline45"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v16m8-8H4"
        ></path>
      </svg>
    </button>
  );
};

export const MinusButton = ({ onClick }: StakeLpButtonProps) => {
  return (
    <button
      className="w-1/2 text-center md:rounded-xl rounded-lg bg-black hover:bg-gray-800 font-medium duration-200 shadow-sm px-2 text-white transition flex justify-center items-center md:py-4 opacity-100 hover:opacity-90 py-2"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
        className="md:h-7 h-6"
        data-config-id="svg-inline46"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"></path>
      </svg>
    </button>
  );
};

interface PoolsButtonProps {
  status: ButtonStatus;
  content: string;
  onClick?: ClickHandler;
}

export const PoolsButton = ({ status, content, onClick }: PoolsButtonProps) => {
  switch (status) {
    case "loading":
      return <LoadingButton content={content} />;
    case "active":
      return <ActiveButton onClick={onClick} content={content} />;
    case "disabled":
    case "error":
      return <InActivateButton content={content} />;

    default:
      return null;
  }
};
