import { Footer } from "components/footer/footer";
import { pairInfo } from "core/config/pairInfo";
import Header from "components/pools/Header";
import PoolsInfo from "components/pools/PoolsInfo";
import { Button } from "components/pools/Button";
import Title from "components/pools/Title";
import StakeLpModal from "components/pools/StakeLpModal";
import UnstakeLpModal from "components/pools/UnstakeLpModal";
import MyPoolsInfoDetails from "components/pools/MyPoolsInfoDetails";
import MyPoolsInfoHarvest from "components/pools/MyPoolsInfoHarvest";
import MyPoolsInfoStakeLP from "components/pools/MyPoolsInfoStakeLP";
import OgTag from "components/common/OgTag";

export default function Pools() {
  return (
    <>
      <OgTag
        title="Pools"
        description="Swap or provide liquidity on the Supernova"
      />
      <section className="relative bg-cover bg-top md:py-24 py-10 bg-black overflow-hidden bg-[url('https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/Background-v4-comp.jpg')]">
        <StakeLpModal />
        <UnstakeLpModal />
        <div className="w-screen grid grid-cols-3 relative xl:px-16 mx-auto xl:space-x-6 container">
          <Title />
          {pairInfo?.map((pair) => {
            return (
              <div
                key={`pools/${pair.asset0.denom}/${pair.asset1.denom}`}
                className="xl:col-span-1 col-span-3 max-w-xl place-self-center xl:place-self-auto md:w-full xl:w-auto mb-10  sm:mx-auto mx-4"
              >
                <div className="md:w-full bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 md:p-1.5 p-1 md:rounded-2xl rounded-lg">
                  <Header pair={pair} />
                  <div className="text-center self-center bg-white md:rounded-b-2xl rounded-b-lg">
                    <div className="px-5 py-4 w-full md:pt-6 md:pb-4 md:px-8 mb-0.5">
                      <PoolsInfo pair={pair} />
                      <Button pair={pair} />
                      <div className="relative shadow-sm bg-gradient-to-r from-yellow-500 via-yellow-500 to-purple-500 md:rounded-xl rounded-lg md:mt-2 mt-1 md:-mx-3 -mx-2.5 p-1">
                        <div className="grid relative w-full mx-auto items-center place-content-between bg-gradient-to-r from-yellow-200 via-yellow-200 to-purple-300 md:rounded-xl rounded-lg grid-cols-8 md:py-7 py-4 md:pb-8 pb-6 md:px-5 px-3">
                          <MyPoolsInfoStakeLP pair={pair} />
                          <MyPoolsInfoHarvest pair={pair} />
                        </div>
                        <MyPoolsInfoDetails pair={pair} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Footer />
      </section>
    </>
  );
}
