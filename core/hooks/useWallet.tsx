/* eslint-disable no-unused-vars */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getKeplrFromWindow } from "@keplr-wallet/stores";
import {
  defaultChainInfo,
  ChainInfo,
  chainInfoList,
} from "../config/chainInfo";
import { OfflineSigner } from "@cosmjs/proto-signing";
const AUTO_CONNECT = "auto_connect";
type WalletContextProps = {
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  enableClient: (info: ChainInfo) => Promise<void>;
  getChainInfo: (name: string) => ChainInfo;
  getSigner: (chainId: string) => OfflineSigner;
  isWalletInstalled: () => boolean;
  enabled: boolean;
  novaAddress: string | null | undefined;
  walletName: string;
  autoConnect: boolean;
};

const WalletContext = createContext<WalletContextProps | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(false);
  const [autoConnect, setAutoConnect] = useState(false);
  const [novaAddress, setNovaAddress] = useState<string | null | undefined>(
    null,
  );
  const [walletName, setWalletName] = useState<string>("");

  const getSigner = (chainId: string): OfflineSigner => {
    const offlineSigner: OfflineSigner = window.keplr.getOfflineSigner(chainId);
    return offlineSigner;
  };

  const enableClient = async (info: ChainInfo) => {
    if (info.needChainSuggestion) {
      await window.keplr.experimentalSuggestChain(info);
    }
    await window.keplr.enable(info.chainId);
  };

  const connectWallet = async () => {
    const keplr = await getKeplrFromWindow();
    if (!keplr) {
      throw new Error("please install keplr extention");
    } else {
      await enableClient(defaultChainInfo);
      setEnabled(true);
      localStorage.setItem(AUTO_CONNECT, JSON.stringify(true));
      return true;
    }
  };

  const disconnectWallet = () => {
    setEnabled(false);
    localStorage.setItem(AUTO_CONNECT, JSON.stringify(false));
  };

  const getChainInfo = (name: string) => {
    const filtered = chainInfoList.filter((x) => x.chainName === name);
    if (filtered.length > 0) {
      return filtered[0];
    }
    throw new Error(`chain info not found with chainName: '${name}'`);
  };

  const isWalletInstalled = () => {
    return typeof window !== "undefined" && window.keplr !== undefined;
  };

  const fetchWallet = useCallback(async () => {
    if (enabled && isWalletInstalled()) {
      const offlineSigner: OfflineSigner = getSigner(defaultChainInfo.chainId);
      const accounts = await offlineSigner.getAccounts();
      setNovaAddress(accounts[0].address);
      getName();
    }
  }, [enabled]);

  const getName = async () => {
    const key = await window.keplr.getKey(defaultChainInfo.chainId);
    setWalletName(key.name);
  };

  useEffect(() => {
    const localData = localStorage.getItem(AUTO_CONNECT);
    const walletAutoConnect: boolean = localData && JSON.parse(localData);
    if (walletAutoConnect) {
      setAutoConnect(walletAutoConnect);
    }
    if (enabled) {
      fetchWallet();
      window.addEventListener("keplr_keystorechange", fetchWallet);

      return () => {
        window.removeEventListener("keplr_keystorechange", fetchWallet);
      };
    }
  }, [enabled, fetchWallet]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet: connectWallet,
        disconnectWallet: disconnectWallet,
        getChainInfo: getChainInfo,
        enableClient: enableClient,
        isWalletInstalled: isWalletInstalled,
        getSigner: getSigner,
        enabled: enabled,
        novaAddress: novaAddress,
        autoConnect: autoConnect,
        walletName: walletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("You forgot to use WalletProvider");
  }

  return context;
};
