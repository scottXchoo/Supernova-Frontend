import { atom } from "recoil";

export const isWithdrawModalOpenAtom = atom<boolean>({
  key: "isWithdrawModalOpen",
  default: false,
});

export const withdrawModalDisplayDenomAtom = atom<string>({
  key: "withdrawModalDisplayDenom",
  default: "",
});

export const isDepositModalOpenAtom = atom<boolean>({
  key: "isDepositModalOpen",
  default: false,
});

export const depositModalDisplayDenomAtom = atom<string>({
  key: "depositModalDisplayDenom",
  default: "",
});
