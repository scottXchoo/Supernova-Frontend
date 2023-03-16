import { getChainFromDenom } from "core/config/ibcAssets";
import { makeIBCMinimalDenom } from "./ibcUtils";
import { PairInfo, pairInfo } from "core/config/pairInfo";
import { AssetComponent, AssetWithAmount } from "./Asset";
import Big from "big.js";

// ToDo : deprecated
export const assetWithAmountFromDenom = (denom: string) => {
  const config = getChainFromDenom(denom);
  if (config == null) {
    return;
  }
  if (denom?.startsWith("sn")) {
    return new AssetWithAmount(
      new AssetComponent(
        config.snCurrencies.coinMinimalDenom,
        config.snCurrencies.coinDenom,
        config.snCurrencies.coinDecimals,
        config.snImagePath,
        config.sourceChannelId,
      ),
      "0",
      makeIBCMinimalDenom(
        config.sourceChannelId,
        config.coinCurrencies.coinMinimalDenom,
      ),
    );
  } else {
    return new AssetWithAmount(
      new AssetComponent(
        makeIBCMinimalDenom(
          config.sourceChannelId,
          config.coinCurrencies.coinMinimalDenom,
        ),
        config.coinCurrencies.coinDenom,
        config.coinCurrencies.coinDecimals,
        config.coinImagePath,
        config.sourceChannelId,
      ),
      "0",
      config.snCurrencies?.coinMinimalDenom,
    );
  }
};

export const assetComponentByDenom = (denom: string) => {
  const getConfig = getChainFromDenom(denom);
  if (getConfig == undefined) {
    return;
  }
  if (denom?.startsWith("sn")) {
    return new AssetComponent(
      getConfig.snCurrencies.coinMinimalDenom,
      getConfig.snCurrencies.coinDenom,
      getConfig.snCurrencies.coinDecimals,
      getConfig.snImagePath,
      getConfig.sourceChannelId,
    );
  } else {
    return new AssetComponent(
      makeIBCMinimalDenom(
        getConfig.sourceChannelId,
        getConfig.coinCurrencies.coinMinimalDenom,
      ),
      getConfig.coinCurrencies.coinDenom,
      getConfig.coinCurrencies.coinDecimals,
      getConfig.coinImagePath,
      getConfig.sourceChannelId,
    );
  }
};

export function pairAddressByDenoms(denom0: string, denom1: string): string {
  const assets = [denom0, denom1];
  const findPairInfo = pairInfo.find((asset) =>
    assets.every((e) => new Set(asset.denoms).has(e)),
  );
  return findPairInfo?.pairContractAddress || pairInfo[0].pairContractAddress;
}

export function lpTokenAddressByDenoms(denom0: string, denom1: string): string {
  const assets = [denom0, denom1];
  const findPairInfo = pairInfo.find((asset) =>
    assets.every((e) => new Set(asset.denoms).has(e)),
  );
  return (
    findPairInfo?.lpTokenContractAddress || pairInfo[0].lpTokenContractAddress
  );
}

export const getPairInfo = (
  denom0: string,
  denom1: string,
): PairInfo | undefined => {
  const assets = [denom0, denom1];
  const findPairInfo = pairInfo.find((asset) =>
    assets.every((e) => new Set(asset.denoms).has(e)),
  );
  return findPairInfo;
};

export const denomByDisplayDenom = (denom: string): string => {
  const config = getChainFromDenom(denom);
  if (denom === "NOVA") {
    return "unova";
  }
  if (denom) {
    if (denom.startsWith("sn")) {
      return config?.snCurrencies.coinMinimalDenom || "snuatom";
    } else {
      return makeIBCMinimalDenom(
        config?.sourceChannelId || "channel-0",
        config?.coinCurrencies.coinMinimalDenom || "uatom",
      );
    }
  } else {
    return makeIBCMinimalDenom(
      config?.sourceChannelId || "channel-0",
      config?.coinCurrencies.coinMinimalDenom || "uatom",
    );
  }
};

export const decimalByDisplayDenom = (denom: string): number => {
  const config = getChainFromDenom(denom);
  if (denom === "NOVA") {
    return 6;
  }
  if (denom) {
    if (denom.startsWith("sn")) {
      return config?.snCurrencies.coinDecimals || 18;
    } else {
      return config?.coinCurrencies.coinDecimals || 6;
    }
  } else {
    return config?.coinCurrencies.coinDecimals || 6;
  }
};

export const decimalByDenom = (denom: string): number => {
  const displayDenom = denomByDisplayDenom(denom);
  const config = getChainFromDenom(displayDenom);
  if (denom === "NOVA") {
    return 6;
  }
  if (denom) {
    if (denom.startsWith("sn")) {
      return config?.snCurrencies.coinDecimals || 18;
    } else {
      return config?.coinCurrencies.coinDecimals || 6;
    }
  } else {
    return config?.coinCurrencies.coinDecimals || 6;
  }
};

export const displayBalanceByDenom = (
  denom: string,
  chainAssets: AssetWithAmount[],
): Big => {
  const assetInfo = assetComponentByDenom(denom);
  if (assetInfo == undefined) {
    return Big(0);
  }
  const balance = chainAssets.find(
    (asset) => asset.assetComponent.displayDenom === denom,
  )?.amount;
  return Big(balance || "0").div(Big(10).pow(assetInfo?.decimal || 0));
};

export const imgByDisplayDenomPair = (denom0: string, denom1: string) => {
  const findPairInfo = pairInfo.find(
    (pair) =>
      (pair.asset0.denom === denom0 && pair.asset1.denom === denom1) ||
      (pair.asset0.denom === denom1 && pair.asset1.denom === denom0),
  );
  const img0 = findPairInfo?.asset0.img || "atom.svg";
  const img1 = findPairInfo?.asset1.img || "snAtom.svg";
  return { img0, img1 };
};
