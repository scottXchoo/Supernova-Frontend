import Big from "big.js";
import { convertBigToFixedString } from "./numberFormatter";

export const calculateDisplayedAmount = (amount: string, decimal: number) => {
  return convertBigToFixedString(
    Big(amount || 0).div(Big(10).pow(decimal || 0)),
    decimal,
  );
};
