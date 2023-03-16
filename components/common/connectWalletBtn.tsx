import { useWallet } from "core/hooks/useWallet";
import React, { useEffect, useState } from "react";
import { useChains } from "core/hooks/useChains";
import TokensDropdown from "./TokensDropdown";
import { toast } from "react-toastify";
import * as gtag from "lib/gtag";
import useUserBalanceList from "core/hooks/useUserBalanceList";
import { useRecoilValue } from "recoil";
import { getNovaAddress } from "core/state/coreState";

export const CopyIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mr-1 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      data-config-id="svg-inline9"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
};

export const DisconnectIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      className="h-6 w-6 ml-1"
    >
      <path
        d="M15.4486 3.55132C13.8789 1.98159 11.3387 1.98159 9.77085 3.55132L7.9729 5.34927L8.91919 6.29556L10.7171 4.49761C11.7154 3.49937 13.4001 3.3936 14.5023 4.49761C15.6063 5.60161 15.5005 7.28452 14.5023 8.28276L12.7043 10.0807L13.6525 11.0289L15.4504 9.23091C17.0165 7.66118 17.0165 5.12104 15.4486 3.55132V3.55132ZM8.28462 14.5023C7.28638 15.5005 5.60161 15.6063 4.49946 14.5023C3.39546 13.3983 3.50122 11.7154 4.49946 10.7171L6.29741 8.91919L5.34927 7.97104L3.55132 9.76899C1.98159 11.3387 1.98159 13.8789 3.55132 15.4467C5.12105 17.0146 7.66118 17.0165 9.22905 15.4467L11.027 13.6488L10.0807 12.7025L8.28462 14.5023V14.5023ZM4.82974 3.8853C4.80184 3.85768 4.76416 3.84218 4.7249 3.84218C4.68564 3.84218 4.64797 3.85768 4.62007 3.8853L3.8853 4.62007C3.85768 4.64797 3.84218 4.68564 3.84218 4.7249C3.84218 4.76416 3.85768 4.80184 3.8853 4.82974L14.172 15.1165C14.2295 15.174 14.3242 15.174 14.3817 15.1165L15.1165 14.3817C15.174 14.3242 15.174 14.2295 15.1165 14.172L4.82974 3.8853Z"
        fill="black"
      ></path>
    </svg>
  );
};

export const ConnectWalletBtn = () => {
  const { autoConnect, enabled, connectWallet, disconnectWallet, walletName } =
    useWallet();
  const { init } = useChains();
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: balanceList } = useUserBalanceList(novaAddress);

  const handleDisconnectWallet = async () => {
    gtag.event({
      action: "click-disconnect-wallet",
      category: "header",
    });
    disconnectWallet();
  };

  const handleConnectWallet = async () => {
    gtag.event({
      action: "click-connect-wallet",
      category: "header",
    });

    await connectWallet();
    await init();

    gtag.event({
      action: "success-connect-wallet",
      category: "header",
    });
  };

  const copyAddress = () => {
    if (novaAddress) {
      navigator.clipboard.writeText(novaAddress);
      toast.success("address copied to clipboard");
    }
  };

  useEffect(() => {
    if (autoConnect) handleConnectWallet();
  }, [autoConnect]);

  return (
    <div className="hidden lg:flex items-center pl-4 justify-center">
      {enabled ? (
        <div className="relative h-9 bg-white py-1 px-1 rounded-xl border border-yellow-500 flex items-center">
          <TokensDropdown balanceList={balanceList} />
          <div className="flex text-black items-center mr-2">
            <div className="inline-block text-sm font-bold mr-2 ">
              {walletName}
            </div>
            <button onClick={copyAddress}>
              <CopyIcon />
            </button>
            <button onClick={handleDisconnectWallet}>
              <DisconnectIcon />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="h-9 bg-gray-900 py-2.5 px-16 rounded-xl border border-yellow-500 group transition ease-in-out hover:bg-gray-800 flex items-center"
        >
          <div className="inline-block text-lg text-yellow-500 font-semibold transition ease-in-out group-hover:opacity-80">
            Connect Wallet
          </div>
        </button>
      )}
    </div>
  );
};

export const MobileConnectWalletBtn = () => {
  const { autoConnect, enabled, connectWallet, disconnectWallet, walletName } =
    useWallet();
  const { init } = useChains();
  const novaAddress = useRecoilValue(getNovaAddress);
  const [openMenu, setOpenMenu] = useState(false);
  const { data: balanceList } = useUserBalanceList(novaAddress);

  const onWalletClicked = () => {
    setOpenMenu(!openMenu);
  };
  const handleDisconnectWallet = async () => {
    gtag.event({
      action: "click-disconnect-wallet",
      category: "header-mobile",
    });
    disconnectWallet();
  };

  const handleConnectWallet = async () => {
    gtag.event({
      action: "click-connect-wallet",
      category: "header-mobile",
    });

    await connectWallet();
    await init();

    gtag.event({
      action: "success-connect-wallet",
      category: "header-mobile",
    });
  };

  const copyAddress = () => {
    if (novaAddress) {
      navigator.clipboard.writeText(novaAddress);
      toast.success("address copied to clipboard");
    }
  };

  useEffect(() => {
    if (autoConnect) handleConnectWallet();
  }, [autoConnect]);

  return (
    <div className="navbar-burger lg:hidden self-center flex items-center justify-center">
      {enabled ? (
        <div className="w-full">
          <button
            onClick={onWalletClicked}
            className="bg-white px-2 py-1.5 rounded-md border border-yellow-500 flex items-center text-black font-semibold text-base"
          >
            {walletName}
          </button>
          {openMenu && (
            <div className="absolute top-24 left-0 w-full z-50 bg-white px-1 items-center py-4 shadow-md flex flex-wrap justify-between border-t border-yellow-500 ">
              <div className="w-full mb-2.5 flex text-black items-center justify-between px-9">
                <div className="inline-block font-semibold text-xl mr-4">
                  {walletName}
                </div>
                <div className="flex items-center">
                  <button onClick={copyAddress}>
                    <CopyIcon />
                  </button>
                  <button onClick={handleDisconnectWallet}>
                    <DisconnectIcon />
                  </button>
                </div>
              </div>
              <div className="w-full px-8">
                <TokensDropdown balanceList={balanceList} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleConnectWallet}>
          <img className="h-7" width="auto" src="/wallet-icon.svg" alt="" />
        </button>
      )}
    </div>
  );
};
