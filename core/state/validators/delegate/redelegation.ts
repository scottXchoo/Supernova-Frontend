import { atom } from "recoil";

export const redelegateToAddressAtom = atom({
  key: "redelegateToAddress",
  default: "",
});

export const redelegateFromAddressAtom = atom({
  key: "redelegateFromAddress",
  default: "",
});
