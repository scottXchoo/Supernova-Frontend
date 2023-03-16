import Big from "big.js";
import { defaultChainInfo } from "core/config/chainInfo";
import { ibcAssets } from "core/config/ibcAssets";
import { BalanceData } from "core/hooks/useUserBalanceList";
import { denomByDisplayDenom } from "core/utils/byDenomUtils";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

const ibcAssetDisplayDenomList = ibcAssets.flatMap((asset) => [
  asset.coinCurrencies.coinDenom,
  asset.snCurrencies.coinDenom,
]);

const assetDisplayDenomListWithOrder = ([] as string[]).concat(
  defaultChainInfo.currencies[0].coinDenom,
  ibcAssetDisplayDenomList,
);

export const assetFamily = atomFamily<BalanceData | null, string>({
  key: "asset",
  default: null,
});

export const assetUSDFamily = atomFamily<string, string>({
  key: "assetUSD",
  default: "0",
});

export const assetDisplayDenomList = atom<string[]>({
  key: "assetDisplayDenomList",
  default: assetDisplayDenomListWithOrder,
});

export const getAllAssetsSelector = selector<BalanceData[]>({
  key: "getAllAssetsSelector",
  get: ({ get }) => {
    const displayDenomList = get(assetDisplayDenomList);
    return displayDenomList.map((displayDenom) => {
      const balance = get(assetFamily(displayDenom));
      if (!balance) {
        return {
          amount: "0",
          denom: denomByDisplayDenom(displayDenom),
          displayDenom: displayDenom,
        };
      } else {
        return balance;
      }
    });
  },
});

export const getTotalAssetUSDSelector = selector<string>({
  key: "getTotalAssetUSDSelector",
  get: ({ get }) => {
    const displayDenomList = get(assetDisplayDenomList);
    let totalAssetUSD = Big(0);
    displayDenomList.map((displayDenom) => {
      const balance = get(assetUSDFamily(displayDenom));
      totalAssetUSD = totalAssetUSD.add(balance);
    });
    return totalAssetUSD.toString();
  },
});

export const assetSelectorFamily = selectorFamily<BalanceData, string>({
  key: "assetSelectorFamily",
  get:
    (denom) =>
    ({ get }) => {
      const balance = get(assetFamily(denom));
      if (!balance) {
        return {
          amount: "0",
          denom: denomByDisplayDenom(denom),
          displayDenom: denom,
        };
      } else {
        return balance;
      }
    },

  set:
    (validatorAddress) =>
    ({ set }, delegation) => {
      set(assetFamily(validatorAddress), delegation);
    },
});
