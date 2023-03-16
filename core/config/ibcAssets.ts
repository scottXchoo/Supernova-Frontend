import {
  COSMOS_CHAINID,
  gaiaDestChannelId,
  gaiaSourceChannelId,
  gaiaUnbondingPeriod,
  junoDestChannelId,
  junoSourceChannelId,
  junoUnbondingPeriod,
  JUNO_CHAINID,
  osmoDestChannelId,
  OSMOSIS_CHAINID,
  osmoSourceChannelId,
  osmoUnbondingPeriod,
} from "core/constants/constants";

export interface IBCAsset {
  counterpartyChainId: string;
  sourceChannelId: string;
  destChannelId: string;
  unbondingPeriod: number;
  coinCurrencies: CoinCurrencies;
  snCurrencies: SnCurrencies;
}

export interface IBCAssetMeta {
  coinImagePath: string;
  snImagePath: string;
}

export interface CoinCurrencies {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
}

export interface SnCurrencies {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
}

export type IBCAssetInfo = IBCAsset & IBCAssetMeta;
export const ibcAssets: IBCAssetInfo[] = [
  {
    counterpartyChainId: COSMOS_CHAINID,
    sourceChannelId: gaiaSourceChannelId,
    destChannelId: gaiaDestChannelId,
    unbondingPeriod: gaiaUnbondingPeriod,
    coinCurrencies: {
      coinMinimalDenom: "uatom",
      coinDenom: "ATOM",
      coinDecimals: 6,
    },
    snCurrencies: {
      coinMinimalDenom: "snuatom",
      coinDenom: "snATOM",
      coinDecimals: 18,
    },
    coinImagePath: "atom.svg",
    snImagePath: "snAtom.svg",
  },
  {
    counterpartyChainId: OSMOSIS_CHAINID,
    sourceChannelId: osmoSourceChannelId,
    destChannelId: osmoDestChannelId,
    unbondingPeriod: osmoUnbondingPeriod,
    coinCurrencies: {
      coinMinimalDenom: "uosmo",
      coinDenom: "OSMO",
      coinDecimals: 6,
    },
    snCurrencies: {
      coinMinimalDenom: "snuosmo",
      coinDenom: "snOSMO",
      coinDecimals: 18,
    },
    coinImagePath: "osmo.svg",
    snImagePath: "snOsmo.svg",
  },
  {
    counterpartyChainId: JUNO_CHAINID,
    sourceChannelId: junoSourceChannelId,
    destChannelId: junoDestChannelId,
    unbondingPeriod: junoUnbondingPeriod,
    coinCurrencies: {
      coinMinimalDenom: "ujuno",
      coinDenom: "JUNO",
      coinDecimals: 6,
    },
    snCurrencies: {
      coinMinimalDenom: "snujuno",
      coinDenom: "snJUNO",
      coinDecimals: 18,
    },
    coinImagePath: "juno.svg",
    snImagePath: "snJuno.svg",
  },
];

export const getChainFromDenom = (denom: string): IBCAssetInfo | undefined => {
  for (const asset of ibcAssets) {
    if (
      asset.coinCurrencies.coinMinimalDenom === denom ||
      asset.coinCurrencies.coinDenom === denom
    )
      return asset;
    if (
      asset.snCurrencies.coinMinimalDenom === denom ||
      asset.snCurrencies.coinDenom === denom
    )
      return asset;
  }
};

export const getChainFromChainId = (
  chainId: string,
): IBCAssetInfo | undefined => {
  for (const asset of ibcAssets) {
    if (asset.counterpartyChainId === chainId) return asset;
  }
};
export const ibcAssetsDenom: string[] = ibcAssets.flatMap(
  (asset) => asset.coinCurrencies.coinMinimalDenom,
);

export const snAssetsDenom: string[] = ibcAssets.flatMap(
  (asset) => "sn" + asset.coinCurrencies.coinMinimalDenom,
);
