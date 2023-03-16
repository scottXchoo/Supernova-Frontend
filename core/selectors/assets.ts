import {
  fetchAllAssets,
  fetchAssets,
  filterIBCAssets,
  filterSnAssets,
  TotalAssets,
} from "core/queries/assets";
import { selector, selectorFamily } from "recoil";
import {
  chainClientAddresses,
  chainClientIndices,
  chainClientList,
} from "core/state/coreState";
import { v1 } from "uuid";
import { defaultChainInfo } from "core/config/chainInfo";
import { AssetWithAmount } from "core/utils/Asset";

//total assets for one chain(include zero amount)
export const chainAssetsQuery = selectorFamily<AssetWithAmount[], string>({
  key: `chainAssetsQuery/${v1()}`,
  get:
    (chainId: string) =>
    async ({ get }) => {
      const clinetKV = get(chainClientIndices);
      const novaIndex = clinetKV[chainId];
      const addresses = get(chainClientAddresses);
      const clients = get(chainClientList);

      const data = await fetchAssets({
        client: clients[novaIndex],
        address: addresses[novaIndex],
      });
      return data;
    },
});

//show all ibc assets in novaChain include 0 amount
export const queryIBCAssetsWithZero = selector<AssetWithAmount[]>({
  key: `queryIBCAssetsWithZero/${v1()}`,
  get: async ({ get }) => {
    const totalNovaAssets = get(chainAssetsQuery(defaultChainInfo.chainId));
    return filterIBCAssets(totalNovaAssets);
  },
});

export const querySnAssetsWithZero = selector<AssetWithAmount[]>({
  key: `querySnAssetsWithZero/${v1()}`,
  get: async ({ get }) => {
    const totalNovaAssets = get(chainAssetsQuery(defaultChainInfo.chainId));
    return filterSnAssets(totalNovaAssets);
  },
});

//total Assets for all chain(non-zero amount)
export const totalAssetsQuery = selector<TotalAssets[]>({
  key: `totalAssetsQuery/${v1()}`,
  get: async ({ get }) => {
    const clinetKV = get(chainClientIndices);
    const addresses = get(chainClientAddresses);
    const clients = get(chainClientList);

    const data = await fetchAllAssets({
      chainClientIndices: clinetKV,
      clients: clients,
      addresses: addresses,
    });
    return data;
  },
}); //1번방식
