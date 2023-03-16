import { Supply } from "core/queries/validators/fetchSupply";
import { atom } from "recoil";

export const supplyAtom = atom<Supply | null>({
  key: "supply",
  default: null,
});
