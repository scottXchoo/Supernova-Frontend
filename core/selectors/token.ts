import { queryBalance, queryTokenInfo } from "core/queries/token";
import { getNovaAddress, getWasmClient } from "core/state/coreState";
import { selectorFamily } from "recoil";
import { contracts } from "supernovajs-contracts";
import { v1 } from "uuid";

export const balanceQuery = selectorFamily<undefined | string, string>({
  key: `balance/${v1()}`,
  get:
    (lpTokenAddress: string) =>
    async ({ get }) => {
      const wasmQueryClient = get(getWasmClient);
      const address = get(getNovaAddress);
      if (wasmQueryClient && address) {
        const queryClient = new contracts.Token.TokenQueryClient(
          wasmQueryClient,
          lpTokenAddress,
        );
        const balance = await queryBalance({ queryClient, address });
        return balance;
      }
    },
});

export const tokenInfoQuery = selectorFamily({
  key: `tokenInfo/${v1()}`,
  get:
    (contractAddress: string) =>
    async ({ get }) => {
      const wasmQueryClient = get(getWasmClient);
      if (wasmQueryClient) {
        const queryClient = new contracts.Token.TokenQueryClient(
          wasmQueryClient,
          contractAddress,
        );
        const tokenInfo = await queryTokenInfo({ queryClient });
        return tokenInfo;
      }
    },
});
