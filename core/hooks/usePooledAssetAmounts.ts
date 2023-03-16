import { usePooledAsset } from "./useLiquidity";
import { PoolAsset } from "../utils/Swap";
import Big from "big.js";

export const usePooledAssetAmounts = (
  denom0: string,
  denom1: string,
  decimal0: number,
  decimal1: number,
) => {
  let pooledAssetAmount: Big = Big(0);
  let pooledSnAssetAmount: Big = Big(0);
  const pooledAsset = usePooledAsset(denom0, denom1);
  if (pooledAsset == null) {
    return { pooledAssetAmount, pooledSnAssetAmount };
  }
  const poolAsset0 = new PoolAsset(pooledAsset, denom0);
  const poolAsset1 = new PoolAsset(pooledAsset, denom1);
  const typeDecidedAsset0 = poolAsset0.decideAssetType(pooledAsset[0].info);
  const typeDecidedAsset1 = poolAsset1.decideAssetType(pooledAsset[1].info);

  if (typeDecidedAsset0 === denom0 && typeDecidedAsset1 === denom1) {
    pooledAssetAmount = new Big(poolAsset0.asset[0].amount).div(
      Big(10).pow(decimal0 || 0),
    );
    pooledSnAssetAmount = new Big(poolAsset0.asset[1].amount).div(
      Big(10).pow(decimal1 || 0),
    );
  } else if (typeDecidedAsset1 === denom0 && typeDecidedAsset0 === denom1) {
    pooledAssetAmount = new Big(poolAsset0.asset[1].amount).div(
      Big(10).pow(decimal0 || 0),
    );
    pooledSnAssetAmount = new Big(poolAsset0.asset[0].amount).div(
      Big(10).pow(decimal1 || 0),
    );
  } else {
    pooledAssetAmount = Big(0);
    pooledSnAssetAmount = Big(0);
  }
  return { pooledAssetAmount, pooledSnAssetAmount };
};
