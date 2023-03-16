import Big from "big.js";
import {
  decimalByDisplayDenom,
  denomByDisplayDenom,
} from "core/utils/byDenomUtils";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import useEstimatedUSD from "../priceFeeder/useEstimatedUSD";
import { useExchangeRate } from "../useExchangeRate";
import { usePooledAssetAmounts } from "../usePooledAssetAmounts";

type TotalPoolBalanceProps = {
  displayDenom: string;
  displayShadowDenom: string;
};

const useTotalPoolBalance = ({
  displayDenom,
  displayShadowDenom,
}: TotalPoolBalanceProps) => {
  const denom = denomByDisplayDenom(displayDenom);
  const denomDecimal = decimalByDisplayDenom(displayDenom);
  const shadowDenom = denomByDisplayDenom(displayShadowDenom);
  const shadowDenomDecimal = decimalByDisplayDenom(displayShadowDenom);

  const { pooledAssetAmount, pooledSnAssetAmount } = usePooledAssetAmounts(
    denom,
    shadowDenom,
    denomDecimal,
    shadowDenomDecimal,
  );
  const zoneName = zoneIdByDisplayDenomMap[displayDenom];
  const { data: exchangeRate } = useExchangeRate(
    displayDenom,
    displayShadowDenom,
  );
  const { estimatedAssetUSD, estimatedSnAssetUSD } = useEstimatedUSD(
    zoneName,
    exchangeRate || Big(1),
    pooledAssetAmount.toString() || "0",
    pooledSnAssetAmount.toString() || "0",
  );
  const totalPoolBalance = Big(estimatedAssetUSD).plus(estimatedSnAssetUSD);

  return totalPoolBalance;
};

export default useTotalPoolBalance;
