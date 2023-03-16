/* eslint-disable prettier/prettier */
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { getChainFromDenom, ibcAssets } from "core/config/ibcAssets";
import { AssetWithAmount } from "../../core/utils/Asset";

type DropdownProps = {
  assets: (AssetWithAmount | string)[];
  styles: string;
  selectedOption: string;
  onOptionClicked: (values: any) => void;
};

export const AutoCompleteList = ({
  assets,
  styles,
  selectedOption,
  onOptionClicked,
}: DropdownProps) => {
  const [query, setQuery] = useState("");

  const filteredAssets =
    query === ""
      ? assets
      : assets.filter((asset: any) => {
          if (typeof asset === "string")
            return asset.toLowerCase().includes(query.toLowerCase());
          else {
            const assetWithAmount: AssetWithAmount = asset;
            return assetWithAmount.assetComponent.displayDenom
              .toLowerCase()
              .includes(query.toLowerCase());
          }
        });

  const getImagePath = (asset: string | AssetWithAmount) => {
    if (typeof asset === "string") {
      return (
        getChainFromDenom(asset)?.coinImagePath || ibcAssets[0].coinImagePath
      );
    } else {
      return asset.assetComponent.imgPath;
    }
  };

  return (
    <Combobox
      as="div"
      value={selectedOption}
      onChange={onOptionClicked}
      className={clsx(
        "md:top-[calc(100%-1.7rem)] top-[calc(100%-1rem)] rounded-b-2xl border-t-0 rounded-t-0 w-full md:px-5 md:py-3 py-2 px-3 md:pt-0 p-4 pt-0 mb-4 absolute",
        {
          "bg-yellow-200 border-solid border-yellow-500 border-2 z-10":
            styles == "yellow",
          "bg-purple-200 border-solid border-purple-300 border-2 z-10":
            styles == "purple",
        },
      )}
    >
      <>
        <div className="col-span-6 mt-3">
          <div
            className={clsx(
              "flex self-center items-center md:px-7 px-3 md:py-1.5 py-1 bg-gray-700 border-2 border-yellow-500 rounded-full mb-2 md:mb-3",
              {
                " border-yellow-500": styles === "yellow",
                " border-purple-300": styles === "purple",
              },
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={clsx("h-6 w-6 mr-2", {
                "text-yellow-500": styles == "yellow",
                "text-purple-300": styles == "purple",
              })}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Combobox.Input
              placeholder="Search Token"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(asset: any) => asset?.denom}
              className="w-full pr-4 bg-transparent text-white font-bold placeholder-white placeholder-opacity-50 placeholder-text-lg outline-none"
            />
          </div>
        </div>
        <div
          className={`${styles}-scroll-box flex flex-col overflow-y-auto md:h-36 h-24 overflow-x-hidden`}
        >
          <div className="md:mr-3 mr-3.5">
            <Combobox.Options static as="ul">
              {filteredAssets.map((asset, id) => (
                <Combobox.Option
                  as="li"
                  key={id}
                  value={asset}
                  className={clsx(
                    "group flex justify-between cursor-default select-none items-center mb-0.5 md:round-xl rounded-lg  md:px-5 md:py-1.5 px-2 py-1",
                    {
                      "hover:bg-yellow-500": styles == "yellow",
                      "hover:bg-purple-300": styles == "purple",
                    },
                  )}
                >
                  <div className="flex flex-row items-center">
                    <div className="md:w-7 md:h-7 w-6 h-6 bg-gray-300 rounded-full relative">
                      <Image
                        src={getImagePath(asset)}
                        alt={"logo"}
                        layout={"fill"}
                      />
                    </div>
                    <span className="mt-1 ml-3 font-semibold text-black md:text-2xl text-sm">
                      {typeof asset === "string"
                        ? getChainFromDenom(asset)?.coinCurrencies.coinDenom
                        : asset.assetComponent.displayDenom}
                    </span>
                  </div>
                  {typeof asset !== "string" && (
                    <div
                      className={clsx(
                        "mt-1 w-1/2 pl-2 md:text-2xl text-sm font-semibold truncate text-right",
                        {
                          "text-black": Number(asset.getDisplayedAmount()) > 0,
                          "text-gray-700":
                            Number(asset.getDisplayedAmount()) == 0,
                        },
                      )}
                    >
                      {asset.getAmount()}
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </div>
      </>
    </Combobox>
  );
};
