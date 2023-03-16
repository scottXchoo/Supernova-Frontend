import Big from "big.js";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { atom, atomFamily, selector, selectorFamily } from "recoil";

export const delegationFamily = atomFamily<Coin | null, string>({
  key: "delegation",
  default: null,
});

export const delegatedValidatorAddressesAtom = atom<string[]>({
  key: "delegatedValidatorAddresses",
  default: [],
});

export const totalDelegationAtom = atom<Big>({
  key: "totalDelegation",
  default: Big(0),
});

export const getDelegationsSelector = selector<(Coin | null)[]>({
  key: "getDelegationsSelector",
  get: ({ get }) => {
    const delegatedValidators = get(delegatedValidatorAddressesAtom);
    const delegations = delegatedValidators.map((delegationValidator) => {
      return get(delegationFamily(delegationValidator));
    });
    return delegations;
  },
});

export const delegationSelectorFamily = selectorFamily<Coin | null, string>({
  key: "delegationSelectorFamily",
  get:
    (validatorAddress) =>
    ({ get }) =>
      get(delegationFamily(validatorAddress)),

  set:
    (validatorAddress) =>
    ({ set }, delegation) => {
      set(delegationFamily(validatorAddress), delegation);
      set(delegatedValidatorAddressesAtom, (prev) => [
        ...new Set([...prev, validatorAddress]),
      ]);
    },
});
