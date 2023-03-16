import { atom } from "recoil";

export type lpModalAtom = {
  inputAmount: string;
  isModalOpen: boolean;
  displayDenom: string;
  displayShadowDenom: string;
};

export const stakeLpModalAtom = atom<lpModalAtom>({
  key: "stakeLpModalAtom",
  default: {
    isModalOpen: false,
    displayDenom: "",
    displayShadowDenom: "",
    inputAmount: "",
  },
});

export const unstakeLpModalAtom = atom<lpModalAtom>({
  key: "unstakeLpModalAtom",
  default: {
    isModalOpen: false,
    displayDenom: "",
    displayShadowDenom: "",
    inputAmount: "",
  },
});
