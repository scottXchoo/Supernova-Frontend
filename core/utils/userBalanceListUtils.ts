import { BalanceData } from "core/hooks/useUserBalanceList";
import {
  PREFIX_IBC,
  PREFIX_SNU,
  UNOVA_MINIMAL_DENOM,
} from "../constants/constants";

export function filterOnlyAssets(balanceList: BalanceData[]) {
  balanceList.filter((list) => list.denom.includes(PREFIX_IBC));
  return balanceList;
}

export function filterOnlySnAssets(balanceList: BalanceData[]) {
  balanceList.filter((list) => list.denom.includes(PREFIX_SNU));
  return balanceList;
}

export function filterExceptNova(balanceList: BalanceData[]) {
  balanceList.filter((list) => list.denom !== UNOVA_MINIMAL_DENOM);
  return balanceList;
}
