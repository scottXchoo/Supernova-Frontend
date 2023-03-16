import { atom } from "recoil";
import { v1 } from "uuid";
import { ibcAssets } from "core/config/ibcAssets";
import { AssetWithAmount } from "core/utils/Asset";

export type TypeStakeAtom = {
  selected: AssetWithAmount | null;
  denom: string;
  amount: string;
  estimatedReturn: string;
};

export const stakeAtom = atom<TypeStakeAtom>({
  key: `stake/${v1()}`,
  default: {
    selected: null,
    denom: "",
    amount: "",
    estimatedReturn: "0",
  },
});

export type TypeUnStakeAtom = {
  selected: AssetWithAmount | null;
  denom: string;
  estimatedReturn: string;
  snAmount: string;
};

export const unstakeAtom = atom<TypeUnStakeAtom>({
  key: `unstake/${v1()}`,
  default: {
    selected: null,
    denom: "",
    estimatedReturn: "0",
    snAmount: "",
  },
});

export type TypeWithdrawAtom = {
  denom: string;
};
export const withdrawAtom = atom<TypeWithdrawAtom>({
  key: `withdraw${v1()}`,
  default: {
    denom: ibcAssets[0].coinCurrencies.coinMinimalDenom,
  },
});
