import { ibcAssets } from "./../config/ibcAssets";

const ibcAssetsMap = ibcAssets.map((asset) => [
  asset.coinCurrencies.coinDenom,
  asset.counterpartyChainId as string,
]);

export const zoneIdByDisplayDenomMap = Object.fromEntries(ibcAssetsMap);
