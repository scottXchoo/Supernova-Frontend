import { atom } from "recoil";

export const bondedTokenAtom = atom<string | null>({
  key: "bondedToken",
  default: null,
});
