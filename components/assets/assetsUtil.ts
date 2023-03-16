import Big from "big.js";
import { getChainFromDenom } from "core/config/ibcAssets";
import { getChainFromIBCDenom } from "core/queries/assets";
import { PREFIX_IBC, UNOVA_MINIMAL_DENOM } from "core/constants/constants";
export const NOVA_ICON_IMAGE_PATH = "nova.svg";

export const getCoinImagePathFromDenom = (denom: string) => {
  if (denom === UNOVA_MINIMAL_DENOM) return NOVA_ICON_IMAGE_PATH;
  else if (denom.startsWith(PREFIX_IBC)) {
    return getChainFromIBCDenom(denom)?.coinImagePath;
  } else {
    return getChainFromDenom(denom)?.snImagePath;
  }
};

export const convertBalanceToLocaleString = (
  balance: string,
  decimal: number,
) => {
  return Big(balance)
    .toNumber()
    .toLocaleString(undefined, { maximumFractionDigits: decimal });
};

export const parseBalanceToLocaleString = (
  balance: string,
  decimal: number,
) => {
  return Big(balance)
    .div(Big(10).pow(decimal))
    .round(decimal, Big.roundDown)
    .toNumber()
    .toLocaleString(undefined, { maximumFractionDigits: decimal });
};
