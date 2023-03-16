import { Footer } from "components/footer/footer";
import LiquidityHeader from "components/swap/LiquidityHeader";
import LiquidityTitle from "components/swap/LiquidityTitle";
import SwapNavigator from "components/swap/SwapNavigator";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

export const LiquidityLayout: React.FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const path = router.pathname.slice(1);

  return (
    <section className="relative bg-clip bg-right-top md:bg-clip md:bg-left-top md:py-24 py-10 xl:bg-cover bg-black overflow-hidden bg-[url('/background-sm.png')] md:bg-[url('/background.png')] xl:bg-[url('/background-lg.png')]">
      <div className="container w-full items-center mx-auto text-center px-4">
        <LiquidityTitle />
        {path === "liquidity" ? <SwapNavigator /> : <LiquidityHeader />}
        <div className="text-center self-center mx-auto bg-white md:rounded-b-2xl rounded-b-lg border-yellow-500 border-b-2 border-r-2 border-l-2 max-w-xl">
          {children}
        </div>
        <Footer />
      </div>
    </section>
  );
};
