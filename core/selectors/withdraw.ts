import { selectorFamily } from "recoil";
import { getNovaAddress, queryClient } from "core/state/coreState";
import { v1 } from "uuid";
import {
  queryPendingWithdrawals,
  queryWithdrawable,
  queryWithdrawRecord,
} from "core/queries/withdraw";
import { AssetComponent, AssetWithAmount } from "core/utils/Asset";
import { getChainFromDenom, ibcAssets } from "core/config/ibcAssets";
import Big from "big.js";
import { convertBigToFixedString } from "core/utils/numberFormatter";

export const withdrawableQuery = selectorFamily<AssetWithAmount, string>({
  key: `withdrawableQuery/${v1()}`,
  get:
    (denom: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);
      const chainInfo = getChainFromDenom(denom) || ibcAssets[0];

      const defaultAsset = new AssetWithAmount(
        new AssetComponent(
          denom,
          chainInfo.coinCurrencies.coinDenom,
          chainInfo.coinCurrencies.coinDecimals,
          chainInfo.coinImagePath,
          chainInfo.counterpartyChainId,
        ),
        "",
      );

      if (novaAddress && chainInfo && novaQueryClient) {
        const withdrawable = await queryWithdrawable({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainInfo.counterpartyChainId,
            address: novaAddress,
          },
        });

        if (!withdrawable) {
          return defaultAsset;
        }

        const assetComponent = new AssetComponent(
          withdrawable.denom,
          chainInfo.coinCurrencies.coinDenom,
          chainInfo.coinCurrencies.coinDecimals,
          chainInfo.coinImagePath,
          chainInfo.counterpartyChainId,
        );
        return new AssetWithAmount(
          assetComponent,
          convertBigToFixedString(
            Big(withdrawable.amount),
            assetComponent.decimal,
          ),
        );
      } else {
        return defaultAsset;
      }
    },
});

export const pendingWithdrawalsQuery = selectorFamily<AssetWithAmount, string>({
  key: `pendingWithdrawalsQuery/${v1()}`,
  get:
    (denom: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);
      const chainInfo = getChainFromDenom(denom) || ibcAssets[0];

      const defaultAsset = new AssetWithAmount(
        new AssetComponent(
          chainInfo.snCurrencies.coinMinimalDenom,
          chainInfo.snCurrencies.coinDenom,
          chainInfo.snCurrencies.coinDecimals,
          chainInfo.snImagePath,
          chainInfo.counterpartyChainId,
        ),
        "",
      );

      if (novaAddress && chainInfo.counterpartyChainId && novaQueryClient) {
        const pendingWithdrawals = await queryPendingWithdrawals({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainInfo.counterpartyChainId,
            address: novaAddress,
          },
        });

        if (!pendingWithdrawals) {
          return defaultAsset;
        }

        const assetComponent = new AssetComponent(
          pendingWithdrawals.denom,
          chainInfo.snCurrencies.coinDenom,
          chainInfo.snCurrencies.coinDecimals,
          chainInfo.snImagePath,
          chainInfo.counterpartyChainId,
        );
        return new AssetWithAmount(
          assetComponent,
          convertBigToFixedString(
            Big(pendingWithdrawals.amount),
            assetComponent.decimal,
          ),
        );
      } else {
        return defaultAsset;
      }
    },
});

export const withdrawRecordQuery = selectorFamily<object, string>({
  key: `withdrawRecordQuery/${v1()}`,
  get:
    (denom: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);
      const chainInfo = getChainFromDenom(denom) || ibcAssets[0];
      if (novaAddress && chainInfo.counterpartyChainId && novaQueryClient) {
        const withdrawRecord = await queryWithdrawRecord({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainInfo.counterpartyChainId,
            address: novaAddress,
          },
        });
        return withdrawRecord;
      } else {
        return {};
      }
    },
});
