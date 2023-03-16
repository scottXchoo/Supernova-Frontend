import Big from "big.js";
import { getChainFromDenom } from "core/config/ibcAssets";
import useEstimatedUSD from "core/hooks/priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "core/hooks/useExchangeRate";
import { BalanceData } from "core/hooks/useUserBalanceList";
import { PREFIX_IBC, UNOVA_MINIMAL_DENOM } from "core/constants/constants";

const useAssetUsdValue = ({ denom, displayDenom, amount }: BalanceData) => {
  const chainInfo = getChainFromDenom(displayDenom);
  const { data: exchangeRate } = useExchangeRate(
    chainInfo?.snCurrencies.coinDenom || "",
    chainInfo?.coinCurrencies.coinDenom || "",
  );
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    chainInfo?.counterpartyChainId || "",
    exchangeRate || Big(1),
    amount,
    amount,
  );

  const isAbleToShowDollars = denom !== UNOVA_MINIMAL_DENOM;

  if (!isAbleToShowDollars) return "0";
  else if (denom.startsWith(PREFIX_IBC)) {
    return estimatedAssetUSD.toString();
  } else {
    return estimatedSnAssetUSD.toString();
  }
};
export default useAssetUsdValue;
