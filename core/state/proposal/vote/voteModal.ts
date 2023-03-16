import { atom } from "recoil";

export const isVoteModalOpenAtom = atom<boolean>({
  key: "voteModalAtom",
  default: false,
});

export const isEditVoteModalOpenAtom = atom<boolean>({
  key: "editVoteModalAtom",
  default: false,
});

export const isVoteSuccessModalOpenAtom = atom<boolean>({
  key: "isVoteSuccessModalOpenAtom",
  default: false,
});
