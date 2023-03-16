import { useState, useEffect } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from "recoil";
import {
  queryIBCAssetsWithZero,
  chainAssetsQuery,
  querySnAssetsWithZero,
} from "core/selectors/assets";
import { defaultChainInfo } from "core/config/chainInfo";
import { AssetWithAmount } from "core/utils/Asset";
import { useWallet } from "./useWallet";

export const useIBCAssets = () => {
  const queryIBCAssets = useRecoilValueLoadable(queryIBCAssetsWithZero);
  const refetchIBCAssets = useRecoilRefresher_UNSTABLE(
    chainAssetsQuery(defaultChainInfo.chainId),
  );
  const [IBCAssets, setIBCAssets] = useState<AssetWithAmount[]>([]);
  const [hasValue, setHasValue] = useState<boolean>(false);
  const { enabled } = useWallet();
  useEffect(() => {
    if (!enabled) {
      setIBCAssets([]);
    }
  }, [enabled]);

  useEffect(() => {
    if (queryIBCAssets.state === "hasValue") {
      setIBCAssets(queryIBCAssets.contents);
      setHasValue(true);
    } else if (queryIBCAssets.state === "hasError") {
      setIBCAssets([]);
    }
  }, [queryIBCAssets]);
  return { IBCAssets, refetchIBCAssets, hasValue };
};

export const useChainAssets = (chainID: string) => {
  const queryChainAssets = useRecoilValueLoadable(chainAssetsQuery(chainID));
  const refetchChainAssets = useRecoilRefresher_UNSTABLE(
    chainAssetsQuery(defaultChainInfo.chainId),
  );

  const [chainAssets, setChainAssets] = useState<AssetWithAmount[]>([]);

  useEffect(() => {
    if (queryChainAssets.state === "hasValue") {
      setChainAssets(queryChainAssets.contents);
    } else if (queryChainAssets.state === "hasError") {
      setChainAssets([]);
    }
  }, [queryChainAssets]);
  const { enabled } = useWallet();
  useEffect(() => {
    if (!enabled) {
      setChainAssets([]);
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", refetchChainAssets);
    return () => {
      window.removeEventListener("keplr_keystorechange", refetchChainAssets);
    };
  }, []);
  return { chainAssets, refetchChainAssets };
};

export const useSnAssets = () => {
  const querySnAssets = useRecoilValueLoadable(querySnAssetsWithZero);
  const refetchSnAssets = useRecoilRefresher_UNSTABLE(
    chainAssetsQuery(defaultChainInfo.chainId),
  );
  const [snAssets, setSnAssets] = useState<AssetWithAmount[]>([]);
  const { enabled } = useWallet();
  useEffect(() => {
    if (!enabled) {
      refetchSnAssets();
    }
  }, [enabled]);

  useEffect(() => {
    if (querySnAssets.state === "hasValue") {
      setSnAssets(querySnAssets.contents);
    }
  }, [querySnAssets]);
  return { snAssets, refetchSnAssets };
};
