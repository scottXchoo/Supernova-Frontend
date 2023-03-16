import Big from "big.js";
import { v1 } from "uuid";
import { atom, selector } from "recoil";

export const SLIPPAGE_VALUES_IN_PERCENT = ["0.5", "1.0", "2.0"];
export const DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT = "2.5";

export type SlippageAtom = {
  isManualSelected: boolean;
  selectedIndex: number;
  manualSlippage: string;
};

export const swapSlippageAtom = atom<SlippageAtom>({
  key: `slippageSwap/${v1()}`,
  default: {
    isManualSelected: false,
    selectedIndex: 0,
    manualSlippage: DEFAULT_CUSTOM_SLIPPAGE_IN_PERCENT,
  },
});

export const getSlippageInPercent = selector<Big>({
  key: "getSlippageInPercent",
  get: ({ get }) => {
    const { isManualSelected, selectedIndex, manualSlippage } =
      get(swapSlippageAtom);

    if (isManualSelected) {
      return Big(manualSlippage || "0");
    } else {
      return Big(SLIPPAGE_VALUES_IN_PERCENT[selectedIndex]);
    }
  },
});

export const isOpenSlippageAtom = atom<boolean>({
  key: `isOpenSlippage/${v1()}`,
  default: false,
});

export type TypeSwapAtom = {
  denom: string;
  amount: Big;
  imgPath: string;
};

export const swapAtom = atom<TypeSwapAtom[]>({
  key: `tokenSwap/${v1()}`,
  default: [
    {
      denom: "",
      amount: Big(0),
      imgPath: "",
    },
    {
      denom: "",
      amount: Big(0),
      imgPath: "",
    },
  ],
});

// ToDo: deprecated
export type LiquidityInfo = {
  upDenom: string;
  downDenom: string;
  upImg: string;
  downImg: string;
  upPooledAmount: Big;
  downPooledAmount: Big;
  balance: Big;
  liquidity_token: string;
  lpDecimal: number;
};

export const liquidityInfoAtom = atom<LiquidityInfo>({
  key: `liquidityRemoveInfo/${v1()}`,
  default: {
    upDenom: "ATOM",
    downDenom: "snATOM",
    upImg: "atom.svg",
    downImg: "snAtom.svg",
    upPooledAmount: Big(0),
    downPooledAmount: Big(0),
    balance: Big(0),
    liquidity_token: "",
    lpDecimal: 6,
  },
});

export type InputAmountDenomAtom = {
  inputAmount: string;
  denom0: string;
  denom1: string;
};

export const liquidityInputAtom = atom<InputAmountDenomAtom>({
  key: `liquidityInput/${v1()}`,
  default: {
    inputAmount: "",
    denom0: "ATOM",
    denom1: "snATOM",
  },
});

export const swapInputAtom = atom<InputAmountDenomAtom>({
  key: `swapInput/${v1()}`,
  default: {
    inputAmount: "",
    denom0: "ATOM",
    denom1: "snATOM",
  },
});

export const isSwapInsufficientBalanceAtom = atom<boolean>({
  key: "isSwapInsufficientBalance",
  default: false,
});
