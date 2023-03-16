import { atom } from "recoil";

export const isUserDelegateAtom = atom<boolean | null>({
  key: "isUserDelegate",
  default: null,
});
