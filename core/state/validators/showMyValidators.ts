import { atom } from "recoil";

export const isMyValidatorsShownAtom = atom<boolean>({
  key: "isMyValidatorsShown",
  default: false,
});
