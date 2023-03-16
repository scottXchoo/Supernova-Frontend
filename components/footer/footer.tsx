import { NovaArrow } from "components/common/novaArrow";
import { Fragment, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import * as gtag from "lib/gtag";
export const Footer = () => {
  const FAQ = [
    {
      title: "What is Supernova?",
      content:
        "Supernova is the ultimate platform for staked assets. We provide three components for achieving the goal: \n First, make all app-chain’s native tokens can be liquidated and make shadow tokens’ solid benefits such as auto-compounding or using them as CDP collaterals. \n Second, develop and provide fair staked swap for staked assets. \n Finally, be a governance bribe protocol as we deploy a single validator on other app-chains.",
    },
    {
      title: "What is snATOM?",
      content:
        "snATOM is a token that represents both your deposit and the rewards you earn on your ATOM each epoch. There is no need to claim your rewards. \n Instead, snATOM acts as a share of the total pool of staked ATOM in Supernova. Since this pool accumulates staking rewards every 6 hours, your share(represented by your snATOM) enables you to withdraw more ATOM.",
    },
    {
      title: "Can I unstake at any time?",
      content:
        "Yes. Supernova allows you to directly swap your snATOM back to ATOM by using our ‘Swap’ feature. If there is enough liquidity left after you unstake, the fee will be 0.3%. You can learn more about our fee structure here.",
    },
    {
      title: "Where can I use snATOM?",
      content:
        "We already provide auto-compounding and staked swap features, but we are developing more to increase the utility of snATOM. For example, it is possible to provide a stablecoin with snAssets as collateral.",
    },
  ];

  const [open, setOpen] = useState(-1);
  const openHandler = (index: number) => {
    gtag.event({
      action: "open-faq",
      category: "footer",
    });
    open === index ? setOpen(-1) : setOpen(index);
  };

  return (
    <div className="mx-auto max-w-xl mt-28">
      <div className="flex flex-wrap items-center mb-12 ">
        <div className="w-full mb-4 md:mb-0">
          <h2 className="mb-6 text-white uppercase text-center font-bold md:text-4xl text-3xl">
            FAQ
          </h2>
        </div>
        {FAQ.map((text, key) => (
          <Fragment key={key}>
            <button
              onClick={() => openHandler(key)}
              className={clsx(
                "w-full block md:py-9 md:px-7 py-5 px-4 bg-white border-blue-500",
                {
                  "md:border-2 border-2 md:rounded-2xl rounded-lg md:rounded-b-none rounded-b-none md:border-b-0 border-b-0":
                    open === key,
                  "md:border-2 border-2 md:rounded-2xl rounded-lg mb-4":
                    open !== key,
                },
              )}
            >
              <div className="w-full flex justify-between">
                <h1
                  className={clsx(
                    "md:text-xl text-lg font-semibold text-black text-left",
                    { "text-blue-500": open === key },
                  )}
                >
                  {text.title}
                </h1>
                <span className="pl-4 flex items-center">
                  <NovaArrow
                    isRotateTop={open === key}
                    style={"text-blue-500"}
                  />
                </span>
              </div>
            </button>
            {key === open && (
              <div
                className="w-full text-left block md:pb-9 md:px-7 pb-5 px-4 bg-white transition-all whitespace-pre-line
              border-blue-500 md:border-2 border-2 md:rounded-2xl rounded-lg md:border-t-0 md:rounded-t-none border-t-0 rounded-t-none
              text-black font-semibold md:text-lg text-sm mb-4"
              >
                {text.content}
              </div>
            )}
          </Fragment>
        ))}
        <Fragment>
          <button
            onClick={() => openHandler(4)}
            className={clsx(
              "w-full block md:py-9 md:px-7 py-5 px-4 bg-white border-blue-500",
              {
                "md:border-2 border-2 md:rounded-2xl rounded-lg md:rounded-b-none rounded-b-none md:border-b-0 border-b-0":
                  open === 4,
                "md:border-2 border-2 md:rounded-2xl rounded-lg mb-4":
                  open !== 4,
              },
            )}
          >
            <div className="w-full flex justify-between">
              <h1
                className={clsx(
                  "md:text-xl text-lg font-semibold text-black text-left",
                  {
                    "text-blue-500": open === 4,
                  },
                )}
              >
                {"Why does the unbonding period take 21-24 days?"}
              </h1>
              <span className="pl-1 flex items-center">
                <NovaArrow isRotateTop={open === 4} style={"text-blue-500"} />
              </span>
            </div>
          </button>
          {open === 4 && (
            <div
              className="w-full text-left block md:pb-9 md:px-7 pb-5 px-4 bg-white transition-all whitespace-pre-line
              border-blue-500 md:border-2 border-2 md:rounded-2xl rounded-lg md:border-t-0 md:rounded-t-none border-t-0 rounded-t-none
              text-black font-semibold md:text-lg text-sm mb-4"
            >
              <div className="relative w-full h-20">
                <Image
                  className="mx-auto mt-5 mb-4 md:mt-12 md:mb-10"
                  src="graph.png"
                  alt=""
                  layout="fill"
                />
              </div>
              <ul className="list-disc mt-6 text-black md:text-lg text-sm px-4">
                <li className="font-semibold mb-6">
                  Processing Period
                  <p className="font-medium mt-2 leading-normal">
                    snATOM unstaking requests are processed in 3 day batches.
                    The unbonding process starts once a batch is finalized at
                    the end of the 3rd day.
                  </p>
                  <p className="font-medium mt-2 leading-normal">
                    If you unstake on the 2nd day of the 3 day batch, you will
                    only have to wait for 1 day of processing period before the
                    batch is finalized.
                  </p>
                </li>
                <li className="font-semibold mb-6">
                  Unbonding (21 days)
                  <p className="font-medium mt-2 leading-normal">
                    The unbonding period is the time taken to unstake your ATOM
                    on Cosmos hub. 21 days is the period set by the Cosmos hub
                    for unstaking and not controlled by Supernova.
                  </p>
                </li>
                <li className="font-semibold mb-6">
                  Estimated Claimable Time
                  <p className="font-medium mt-2 leading-normal">
                    {`Your total 21 days unbonding period + processing time will be showcased to your under "Est. Time"`}
                  </p>
                </li>
                <li className="font-semibold">
                  snATOM Claimable
                  <p className="font-medium mt-2 leading-normal">
                    Once your snATOM completes the unbonding process, you will
                    be able to claim it
                  </p>
                </li>
              </ul>
            </div>
          )}
        </Fragment>
      </div>
    </div>
  );
};
