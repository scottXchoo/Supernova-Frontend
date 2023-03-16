import { Footer } from "components/footer/footer";
import SwapNavigator from "components/swap/SwapNavigator";
import { SwapModule } from "components/swap/SwapModule";
import SwapTitle from "components/swap/SwapTitle";
import OgTag from "components/common/OgTag";

export default function Swap() {
  return (
    <>
      <OgTag
        title="Swap"
        description="Swap or provide liquidity on the Supernova"
      />
      <section className="relative bg-clip bg-right-top md:bg-clip md:bg-left-top md:py-24 py-10 xl:bg-cover bg-black overflow-hidden bg-[url('/background-sm.png')] md:bg-[url('/background.png')] xl:bg-[url('/background-lg.png')]">
        <div className="container w-full items-center mx-auto text-center px-4">
          <div className="inline-block">
            <SwapTitle />
            <SwapNavigator />
            <div className="text-center mx-auto self-center bg-white md:rounded-b-2xl rounded-b-lg border-yellow-500 border-b-2 border-r-2 border-l-2 max-w-xl">
              <SwapModule />
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}
