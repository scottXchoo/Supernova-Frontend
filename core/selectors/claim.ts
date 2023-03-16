import { selectorFamily } from "recoil";
import {
  queryClaimableAssets,
  queryPendingDepositAssets,
} from "core/queries/claim";
import { getNovaAddress, queryClient } from "core/state/coreState";
import { v1 } from "uuid";

export const claimableAssetsQuery = selectorFamily<string, string>({
  key: `claimableAssetsQuery/${v1()}`,
  get:
    (chainId: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);
      if (novaAddress && chainId && novaQueryClient) {
        const claimable = await queryClaimableAssets({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainId,
            address: novaAddress,
          },
        });
        return claimable?.amount || "0";
      } else {
        return "0";
      }
    },
});

export const depositAssetsQuery = selectorFamily<string, string>({
  key: `depositAssetsQuery/${v1()}`,
  get:
    (chainId: string) =>
    async ({ get }) => {
      const novaQueryClient = get(queryClient);
      const novaAddress = get(getNovaAddress);

      if (novaAddress && chainId && novaQueryClient) {
        const pendingDeposit = await queryPendingDepositAssets({
          queryClient: novaQueryClient,
          param: {
            zoneId: chainId,
            address: novaAddress,
          },
        });
        return pendingDeposit?.amount || "0";
      } else {
        return "0";
      }
    },
});
