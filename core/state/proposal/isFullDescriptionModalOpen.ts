import { atom } from "recoil";

export const isFullDescriptionModalOpenAtom = atom<boolean>({
  key: "isFullDescriptionModalOpen",
  default: false,
});
