import { Coin } from "@cosmjs/stargate";
import Big from "big.js";
import { getChainFromDenom } from "core/config/ibcAssets";
import { queryEstimatedSnAsset } from "core/queries/estimate";
import { getNovaAddress, queryClient } from "core/state/coreState";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { selectorFamily } from "recoil";
import { v1 } from "uuid";

export const estimateSnAssetQuery = selectorFamily<Coin | null, string>({
  key: `estimateSnAssetQuery/${v1()}`,
  get:
    (denom: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);
      const chainInfo = getChainFromDenom(denom);
      if (novaAddress && chainInfo && novaQueryClient) {
        const ibcDenom = makeIBCMinimalDenom(chainInfo?.sourceChannelId, denom);
        const estimated = await queryEstimatedSnAsset({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainInfo?.counterpartyChainId,
            amount: convertBigToFixedString(
              Big(10).pow(chainInfo?.coinCurrencies.coinDecimals || 0),
              18,
            ),
            denom: ibcDenom,
          },
        });
        return estimated || null;
      } else {
        return null;
      }
    },
});
