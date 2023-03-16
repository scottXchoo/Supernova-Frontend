import { liquidityInputAtom } from "../state/swapState";
import { selectorFamily } from "recoil";
import { decimalByDisplayDenom } from "../utils/byDenomUtils";
import { contracts } from "supernovajs-contracts";
import { getWasmClient } from "core/state/coreState";
import { queryPair, queryPool, queryReturnAmount } from "../queries/pair";
import {
  PairInfo,
  PoolResponse,
} from "supernovajs-contracts/types/codegen/Pair.types";
import { v1 } from "uuid";
import Big from "big.js";
import { convertBigToFixedString } from "core/utils/numberFormatter";

export const returnAmountQueryLiquidity = selectorFamily<
  undefined | string,
  string
>({
  key: `returnAmountQueryLiquidity/${v1()}`,
  get:
    (pairAddress: string) =>
    async ({ get }) => {
      const wasmQueryClient = get(getWasmClient);
      const liquidityInput = get(liquidityInputAtom);
      if (wasmQueryClient) {
        const selectedDenom = liquidityInput.denom0;
        const denomDecimal = decimalByDisplayDenom(selectedDenom);
        const input = liquidityInput.inputAmount;
        const inputToInitialNumber =
          !input || input == "" || input == "0" ? Big(1) : Big(input);
        const inputAmount = convertBigToFixedString(
          inputToInitialNumber.mul(Math.pow(10, denomDecimal || 0)),
          denomDecimal,
        );
        const queryClient = new contracts.Pair.PairQueryClient(
          wasmQueryClient,
          pairAddress,
        );
        return await queryReturnAmount({
          queryClient,
          selectedDenom,
          inputAmount,
        });
      }
    },
});

export const poolQuery = selectorFamily<undefined | PoolResponse, string>({
  key: `poolQuery/${v1()}`,
  get:
    (pairAddress: string) =>
    async ({ get }) => {
      const wasmQueryClient = get(getWasmClient);
      if (wasmQueryClient) {
        const queryClient = new contracts.Pair.PairQueryClient(
          wasmQueryClient,
          pairAddress,
        );
        return await queryPool({ queryClient });
      }
    },
});

export const pairQuery = selectorFamily<undefined | PairInfo, string>({
  key: `pairInfo/${v1()}`,
  get:
    (pairAddress: string) =>
    async ({ get }) => {
      const wasmQueryClient = get(getWasmClient);
      if (wasmQueryClient) {
        const queryClient = new contracts.Pair.PairQueryClient(
          wasmQueryClient,
          pairAddress,
        );
        return await queryPair({ queryClient });
      }
    },
});
