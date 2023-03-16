import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { atom, atomFamily } from "recoil";

export const rewardFamily = atomFamily<Coin | null, string>({
  key: "reward",
  default: null,
});

export const rewardValidatorAddressesAtom = atom<string[]>({
  key: "rewardValidatorAddresses",
  default: [],
});
