import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";

export const StakeHeader = () => {
  const router = useRouter();
  const baseStyle =
    "w-1/3 w-1/3 md:pt-3 md:pb-2 pt-1.5 pb-1 px-1 md:mx-2 mx-1 text-center md:text-2xl text-lg";

  return (
    <div className="text-center self-center mx-auto bg-black md:rounded-t-2xl rounded-t-lg border-yellow-500 border-t-2 border-r-2 border-l-2 max-w-xl">
      <div className="block">
        <div className="border-b-2 border-yellow-500">
          <nav
            className="-mb-px flex justify-center md:mx-14 mx-4"
            aria-label="Tabs"
          >
            <Link href={"/stake"}>
              <a
                className={clsx(baseStyle, {
                  "border-b-8 border-yellow-500 text-yellow-500 font-bold":
                    router.pathname === "/stake",
                  "border-transparent text-gray-700 hover:text-yellow-500 font-medium":
                    router.pathname !== "/stake",
                })}
                aria-current="page"
              >
                Stake
              </a>
            </Link>

            <Link href={"/unstake"}>
              <a
                className={clsx(baseStyle, {
                  "border-b-8 border-yellow-500 text-yellow-500 font-bold":
                    router.pathname === "/unstake",
                  "border-transparent text-gray-700 hover:text-yellow-500 font-medium":
                    router.pathname !== "/unstake",
                })}
                aria-current="page"
              >
                Unstake
              </a>
            </Link>
            <Link href={"/claim"}>
              <a
                className={clsx(baseStyle, {
                  "border-b-8 border-yellow-500 text-yellow-500 font-bold":
                    router.pathname === "/claim",
                  "border-transparent text-gray-700 hover:text-yellow-500 font-medium":
                    router.pathname !== "/claim",
                })}
                aria-current="page"
              >
                Claim
              </a>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
