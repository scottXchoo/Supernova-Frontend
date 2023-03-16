import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import SlippageToggle from "./SlippageToggle";

const SwapNavigator = () => {
  const router = useRouter();

  const baseStyle =
    "w-1/2 md:pt-3 md:pb-2 pt-1.5 px-1 pb-1 px-1 text-center md:text-2xl text-lg font-semibold";
  const activeStyle = "border-yellow-500 text-yellow-500 border-b-8 font-bold";
  const inactiveStyle =
    "border-transparent text-gray-700 hover:text-yellow-500 font-medium";

  return (
    <div className="flex text-center self-center mx-auto bg-black md:rounded-t-2xl rounded-t-lg border-yellow-500 border-t-2 border-r-2 border-l-2 max-w-xl border-b-2 md:px-8 px-4">
      <div className="block md:w-1/2 w-2/3">
        <div>
          <nav className="-mb-px flex justify-center" aria-label="Tabs">
            <Link href="/swap">
              <a
                className={clsx(
                  baseStyle,
                  "md:mr-2 mr-1",
                  `${
                    router.pathname === "/swap" ? activeStyle : inactiveStyle
                  }`,
                )}
                aria-current="page"
              >
                Swap
              </a>
            </Link>
            <Link href="/liquidity">
              <a
                className={clsx(
                  baseStyle,
                  `${
                    router.pathname === "/liquidity"
                      ? activeStyle
                      : inactiveStyle
                  }`,
                )}
                aria-current="page"
              >
                Liquidity
              </a>
            </Link>
          </nav>
        </div>
      </div>
      {router.pathname === "/swap" && <SlippageToggle />}
    </div>
  );
};

export default SwapNavigator;
