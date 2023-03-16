import Big from "big.js";
import useCoinPrice from "core/hooks/priceFeeder/useCoinPrice";
import { convertBigToFixedString } from "core/utils/numberFormatter";

const useEstimatedUSD = (
  zoneName: string,
  ratio: Big,
  assetInput: string,
  snAssetInput: string,
) => {
  const assetPrice = useCoinPrice(zoneName);
  const assetUSD = Big(assetPrice.data?.usd || 0);
  const snAssetUSD = assetUSD.div(ratio.eq(Big(0)) ? Big(1) : ratio);
  const estimatedAssetUSD = convertBigToFixedString(
    assetUSD.mul(assetInput || "0"),
    6,
  );
  const estimatedSnAssetUSD = convertBigToFixedString(
    snAssetUSD.mul(snAssetInput || "0"),
    6,
  );
  return {
    assetUSD,
    estimatedAssetUSD,
    snAssetUSD,
    estimatedSnAssetUSD,
  };
};

export default useEstimatedUSD;
