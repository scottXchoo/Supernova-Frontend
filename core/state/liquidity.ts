import { atom } from "recoil";

export const isUpperAssetInsufficientBalanceAtom = atom({
  key: "isUpperAssetInsufficientBalance",
  default: false,
});
export const isLowerAssetInsufficientBalanceAtom = atom({
  key: "isLowerAssetInsufficientBalance",
  default: false,
});
