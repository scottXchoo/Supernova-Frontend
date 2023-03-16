import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { defaultChainInfo } from "core/config/chainInfo";
import { BalanceData } from "core/hooks/useUserBalanceList";

type TypeTokensDropdown = {
  balanceList: BalanceData[] | null;
};

export default function TokensDropdown({ balanceList }: TypeTokensDropdown) {
  balanceList?.filter((list) => list.amount !== "0");
  const defaultAmount = balanceList ? balanceList[0]?.amount : "0";
  const defaultDisplayDenom = balanceList
    ? balanceList[0]?.displayDenom
    : "NOVA";

  return (
    <Menu
      as="div"
      className="lg:relative inline-block text-left w-full lg:w-auto "
    >
      <div>
        <Menu.Button className="flex text-black h-full rounded-md py-1.5 pl-4 px-2 w-full lg:w-auto  lg:px-2 bg-yellow-500 lg:mr-2 items-center text-lg lg:text-sm font-medium">
          <div className="flex flex-row justify-between w-full">
            <span>{defaultAmount} </span>
            <span>{defaultDisplayDenom}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1 lg:ml-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            data-config-id="svg-inline8"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 top-24 mt-5 lg:-mx-1 lg:top-8 z-50 lg:mt-2 lg:py-1 origin-top-right lg:rounded-md bg-white border-t lg:border-2 border-yellow-500 shadow-md w-full lg:w-auto">
          {balanceList?.map((asset, key) => (
            <Menu.Item disabled key={key} as="div" className="px-1">
              {(asset?.amount !== "0" ||
                asset?.denom ===
                  defaultChainInfo.currencies[0].coinMinimalDenom) && (
                <div className="block whitespace-nowrap text-lg pr-9 border-b pl-14 py-4 lg:pr-7 text-black font-medium lg:pl-3 lg:py-1.5 w-full lg:h-auto lg:w-auto lg:rounded-md lg:text-sm bg-white cursor">
                  {asset?.amount} {asset?.displayDenom}
                </div>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
