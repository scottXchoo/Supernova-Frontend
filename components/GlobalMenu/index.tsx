import React from "react";
import {
  ConnectWalletBtn,
  MobileConnectWalletBtn,
} from "../common/connectWalletBtn";
import { atom, RecoilRoot, useRecoilState } from "recoil";
import Home from "./Home";
import Mobile from "./mobile";
import Desktop from "./desktop";

export const isMenuOpenAtom = atom<boolean>({
  key: "menu/isOpen",
  default: false,
});

const GlobalMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(isMenuOpenAtom);
  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen);

  return (
    <section className="w-full z-50">
      <nav className="relative bg-black">
        <div className="lg:container lg:mx-auto mx-7 h-24 lg:py-0 py-4 xl:max-w-7xl lg:max-w-6xl xl:px-0 lg:px-6 px-0">
          <div className="flex justify-between items-center cursor-pointer">
            <Home />
            {/* menu for mobile */}
            <RecoilRoot override={false}>
              <div className="lg:hidden flex lg:py-8 py-5 items-center">
                <MobileConnectWalletBtn />
                <button
                  onClick={toggleMenu}
                  className="-mt-0.5 lg:hidden self-center text-white hover:text-yellow-500 focus:text-yellow-500 ml-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className={"bg-black fixed top-0 left-0 w-full z-50"}>
                    <div className="lg:container lg:mx-auto mx-7 h-24 lg:py-0 py-4 xl:max-w-7xl lg:max-w-6xl xl:px-0 lg:px-6 px-0">
                      <div className="flex justify-between items-center cursor-pointer">
                        <Home />
                        <div className="flex space-x-3 lg:py-8 py-5 items-center">
                          <MobileConnectWalletBtn />
                          <button
                            onClick={toggleMenu}
                            className="-mt-0.5 lg:hidden self-center text-white hover:text-yellow-500 focus:text-yellow-500"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-7"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <Mobile.Item href="/stake">Stake</Mobile.Item>

                    <Mobile.Group title="Swap">
                      <Mobile.GroupItem href="/swap">Swap</Mobile.GroupItem>
                      <Mobile.GroupItem href="/liquidity">
                        Liquidity
                      </Mobile.GroupItem>
                    </Mobile.Group>

                    <Mobile.Item href="/pools">Pools</Mobile.Item>

                    <Mobile.Group title="Govern">
                      <Mobile.GroupItem href="/governance/validators">
                        Validators
                      </Mobile.GroupItem>
                      <Mobile.GroupItem href="/governance/proposals">
                        Proposals
                      </Mobile.GroupItem>
                    </Mobile.Group>

                    <Mobile.Item href="/assets">Assets</Mobile.Item>
                    <Mobile.Item
                      href="http://faucet.dev-supernova.xyz/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Faucet
                    </Mobile.Item>
                  </div>
                )}
              </div>
            </RecoilRoot>
            {/* menu for desktop */}
            <div className="hidden lg:flex lg:justify-end lg:items-center lg:py-8 py-5">
              <ul className="flex justify-center mr-4">
                <Desktop.Item href="/stake">Stake</Desktop.Item>

                <Desktop.Group title="Swap">
                  <Desktop.GroupItem href="/swap">Swap</Desktop.GroupItem>
                  <Desktop.GroupItem href="/liquidity">
                    Liquidity
                  </Desktop.GroupItem>
                </Desktop.Group>

                <Desktop.Item href="/pools">Pools</Desktop.Item>

                <Desktop.Group title="Govern">
                  <Desktop.GroupItem href="/governance/validators">
                    Validators
                  </Desktop.GroupItem>
                  <Desktop.GroupItem href="/governance/proposals">
                    Proposals
                  </Desktop.GroupItem>
                </Desktop.Group>

                <Desktop.Item href="/assets">Assets</Desktop.Item>
                <Desktop.Item
                  href="http://faucet.dev-supernova.xyz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Faucet
                </Desktop.Item>
              </ul>
              <ConnectWalletBtn />
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
};

export default GlobalMenu;
