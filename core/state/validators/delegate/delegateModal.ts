import { atom, selector } from "recoil";

export const isDelegateModalOpenAtom = atom<boolean>({
  key: "isDelegateModalOpen",
  default: false,
});

export const isDelegateSuccessModalOpenAtom = atom<boolean>({
  key: "isDelegateSuccessModalOpen",
  default: false,
});

export const delegateAmountAtom = atom<string>({
  key: "delegateAmount",
  default: "0",
});

export const undelegateAmountAtom = atom<string>({
  key: "undelegateAmount",
  default: "0",
});

export const delegateOperatorAddressAtom = atom({
  key: "delegateOperatorAddress",
  default: "",
});

export const modalsAtom = atom({
  key: "modalsAtom/delegateModal",
  default: {
    baseModal: false,
    manageMyValidator: false,
    manageValidator: false,
    redelegateFromList: false,
    redelegateToList: false,
    redelegateFrom: false,
    redelegateTo: false,
    delegate: false,
    addDelegate: false,
    undelegate: false,
  },
});

export const modalsAtomSelector = selector({
  key: "modalsAtomSelector",
  get: ({ get }) => get(modalsAtom),
  set: ({ set }, newValue) =>
    set(modalsAtom, (prev) => ({ ...prev, newValue })),
});
