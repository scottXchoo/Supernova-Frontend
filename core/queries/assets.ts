import { coin, Coin, SigningStargateClient } from "@cosmjs/stargate";
import Big from "big.js";
import { defaultChainInfo } from "core/config/chainInfo";
import {
  getChainFromDenom,
  ibcAssets,
  snAssetsDenom,
} from "core/config/ibcAssets";
import { ClientIndexMap } from "core/state/coreState";
import { AssetComponent, AssetWithAmount } from "core/utils/Asset";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import * as Sentry from "@sentry/react";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { decimalByDenom } from "core/utils/byDenomUtils";
import { PREFIX_IBC } from "core/constants/constants";

export type FetchAllAssetsProps = {
  chainClientIndices: ClientIndexMap;
  clients: SigningStargateClient[] | null | undefined;
  addresses: string[] | null | undefined;
};

export type FetchAssetsProps = {
  client: SigningStargateClient | null | undefined;
  address: string | null | undefined;
};
export type TotalAssets = {
  chain: string;
  assets: Coin[];
};
export const fetchAllAssets = async ({
  chainClientIndices,
  clients,
  addresses,
}: FetchAllAssetsProps) => {
  if (clients && addresses) {
    const totalAssets: TotalAssets[] = [];
    for (const key in chainClientIndices) {
      const chainName = key;
      const index = chainClientIndices[key];
      const fetchedAssets = await clients[index].getAllBalances(
        addresses[index],
      );
      const assets: Coin[] = [];
      fetchedAssets.forEach((asset: Coin) => {
        if (asset.denom.includes(PREFIX_IBC)) {
          const convertedToken = convertIbcToNative(asset);
          if (!convertedToken) {
            throw new Error("Unknown asset"); //error handle 방식 통일 필요
          }
          assets.push(convertedToken);
        } else {
          assets.push(asset);
        }
      });
      totalAssets.push({
        chain: chainName,
        assets: assets,
      });
    }
    return totalAssets;
  } else {
    return [];
  }
};

export const getChainFromIBCDenom = (balance: string) => {
  const chainInfo = ibcAssets.find(
    (ibcAsset) =>
      makeIBCMinimalDenom(
        ibcAsset.sourceChannelId,
        ibcAsset.coinCurrencies.coinMinimalDenom,
      ) == balance,
  );
  if (chainInfo) {
    return chainInfo;
  }
  return undefined;
};

/*
  asset order
  nova
  atom
  snatom
  osmo
  snosmo
  juno
  snjuno
*/

export const fetchAssets = async ({ client, address }: FetchAssetsProps) => {
  const assetsWithOrder: AssetWithAmount[] = [];
  assetsWithOrder.push(
    new AssetWithAmount(
      new AssetComponent(
        defaultChainInfo.currencies[0].coinMinimalDenom,
        defaultChainInfo.currencies[0].coinDenom,
        defaultChainInfo.currencies[0].coinDecimals,
        "/",
        defaultChainInfo.chainId,
      ), //TODO : add nova image path
      "0",
    ),
  );

  for (const asset of ibcAssets) {
    assetsWithOrder.push(
      new AssetWithAmount(
        new AssetComponent(
          makeIBCMinimalDenom(
            asset.sourceChannelId,
            asset.coinCurrencies.coinMinimalDenom,
          ),
          asset.coinCurrencies.coinDenom,
          asset.coinCurrencies.coinDecimals,
          asset.coinImagePath,
          asset.counterpartyChainId,
        ),
        "0",
        asset.snCurrencies.coinMinimalDenom,
      ),
    );

    assetsWithOrder.push(
      new AssetWithAmount(
        new AssetComponent(
          asset.snCurrencies.coinMinimalDenom,
          asset.snCurrencies.coinDenom,
          asset.snCurrencies.coinDecimals,
          asset.snImagePath,
          asset.counterpartyChainId,
        ),
        "0",
        makeIBCMinimalDenom(
          asset.sourceChannelId,
          asset.coinCurrencies.coinMinimalDenom,
        ),
      ),
    );
  }

  if (client && address) {
    try {
      const fetchedAssets = await client.getAllBalances(address);
      fetchedAssets.forEach((asset: Coin) => {
        const decimal = decimalByDenom(asset.denom);

        if (asset.denom.includes(PREFIX_IBC)) {
          //asset is "ibc asset"
          const chainInfo = getChainFromIBCDenom(asset.denom);
          if (chainInfo) {
            const idx = assetsWithOrder.findIndex(
              (x) => x.assetComponent.denom === asset.denom,
            );
            if (idx >= 0) {
              assetsWithOrder[idx].amount = convertBigToFixedString(
                Big(asset.amount),
                decimal,
              );
            }
          } else {
            //chain is invalid
          }
        } else if (
          asset.denom === defaultChainInfo.currencies[0].coinMinimalDenom
        ) {
          //asset is "nova"
          assetsWithOrder[0].amount = convertBigToFixedString(
            Big(asset.amount),
            decimal,
          );
        } else {
          //asset is "snAsset"
          const chainInfo = getChainFromDenom(asset.denom);
          if (chainInfo) {
            const idx = assetsWithOrder.findIndex(
              (x) =>
                x.assetComponent.denom ===
                chainInfo?.snCurrencies.coinMinimalDenom,
            );
            if (idx >= 0)
              assetsWithOrder[idx].amount = convertBigToFixedString(
                Big(asset.amount),
                decimal,
              );
          }
        }
      });
      return assetsWithOrder;
    } catch (e) {
      console.log(e);
      Sentry.captureException(e);
      return [];
    }
  } else {
    return [];
  }
};

export const filterIBCAssets = (allAssets: AssetWithAmount[]) => {
  const IBCAssets: AssetWithAmount[] = allAssets.filter(
    (asset: AssetWithAmount) =>
      asset.assetComponent.denom.startsWith(PREFIX_IBC),
  );
  return IBCAssets;
};

export const filterSnAssets = (allAssets: AssetWithAmount[]) => {
  const SNAssets: AssetWithAmount[] = allAssets.filter(
    (asset: AssetWithAmount) =>
      !asset.assetComponent.denom.startsWith(PREFIX_IBC) &&
      asset.assetComponent.denom !==
        defaultChainInfo.currencies[0].coinMinimalDenom,
  );
  return SNAssets;
};

export const fetchSnAssets = async ({ client, address }: FetchAssetsProps) => {
  if (client && address) {
    const fetchedAssets = await client.getAllBalances(address); //체인에서 0 이상인 잔고 긁어옴
    const assets: Coin[] = snAssetsDenom.map((denom) => ({
      denom,
      amount: "0",
    }));
    if (fetchedAssets) {
      fetchedAssets.forEach((asset: Coin) => {
        if (asset.denom.startsWith("sn")) {
          const idx = assets.findIndex((d) => d.denom === asset?.denom);
          if (idx >= 0) assets[idx] = asset;
        }
      });
    } else {
      return [];
    }
    return assets;
  } else {
    return [];
  }
};

type ConvertIbcToNative = {
  // eslint-disable-next-line no-unused-vars
  (balance?: Coin): Coin | undefined;
};
const convertIbcToNative: ConvertIbcToNative = (balance) => {
  /*
        ibc 토큰 관리 방식 잘 고민해야할듯
     */

  const ibcInfo = ibcAssets.find(
    (ibcAsset) =>
      makeIBCMinimalDenom(
        ibcAsset.sourceChannelId,
        ibcAsset.coinCurrencies.coinMinimalDenom,
      ) == balance?.denom,
  );
  if (ibcInfo) {
    return coin(
      String(balance?.amount),
      ibcInfo?.coinCurrencies.coinMinimalDenom,
    );
  }
  return undefined;
};
