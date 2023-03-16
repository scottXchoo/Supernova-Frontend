import Big from "big.js";
import { NOVA_DECIMAL } from "core/constants/constants";
import { convertBigToFixedString } from "core/utils/numberFormatter";
export const DEFAULT_NUMBER_STRING = "--";
export const parseNovaBalanceToLocaleStringRoundDown = (
  delegatorShares: string,
) => {
  return Big(delegatorShares)
    .div(Big(10).pow(NOVA_DECIMAL))
    .round(0, Big.roundDown)
    .toNumber()
    .toLocaleString();
};

export const convertDecimalToPercentage = (decimalNumber: Big) => {
  return decimalNumber.mul(100).toFixed(2, Big.roundDown);
};

export const convertValidatorCommissionRate = (commissionRate: string) => {
  return convertBigToFixedString(Big(commissionRate || "0").mul(100), 2);
};

export const calculateValidatorAPR = (
  commissionRate: string,
  novaAPRPercent: number,
) => {
  return convertBigToFixedString(
    Big(1)
      .minus(Big(commissionRate || "0"))
      .mul(Big(novaAPRPercent || "0")),
    2,
  );
};

export const parseNovaBalanceToLocaleString = (balance: string) => {
  return Big(balance)
    .div(Big(10).pow(NOVA_DECIMAL))
    .round(NOVA_DECIMAL, Big.roundDown)
    .toNumber()
    .toLocaleString(undefined, { maximumFractionDigits: NOVA_DECIMAL });
};
