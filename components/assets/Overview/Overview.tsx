import Big from "big.js";
import clsx from "clsx";
import { parseNovaBalanceToLocaleString } from "components/validators/delegate/delegateUtils";
import { ibcAssets } from "core/config/ibcAssets";
import { MAXIMUM_DECIMAL_POINT } from "core/constants/constants";
import useTotalLpBalance from "core/hooks/pools/useTotalLpBalance";
import { LG_WINDOW_SIZE, useWindowSize } from "core/hooks/useWindowSize";
import useDelegations from "core/hooks/validators/useDelegations";
import useUnbondingRecords from "core/hooks/validators/useUnbondingRecords";
import { getTotalAssetUSDSelector } from "core/state/assets/assets";
import { getNovaAddress } from "core/state/coreState";
import { totalDelegationAtom } from "core/state/validators/delegate/delegation";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { convertBalanceToLocaleString } from "../assetsUtil";
import AssetBox from "./AssetBox";

const Overview = () => {
  const { isMobile } = useWindowSize(LG_WINDOW_SIZE);
  const novaAddress = useRecoilValue(getNovaAddress);
  useDelegations(novaAddress);
  const totalDelegation = useRecoilValue(totalDelegationAtom);
  const { data: unbondingRecords } = useUnbondingRecords(novaAddress);
  const totalUnbondingAmount = useMemo(
    () =>
      unbondingRecords?.reduce((a, b) => Big(a).add(Big(b.balance)), Big(0)) ||
      Big(0),
    [unbondingRecords],
  );
  const totalBondedNova = totalDelegation.add(totalUnbondingAmount).toString();
  const totalAssetUSD = useRecoilValue(getTotalAssetUSDSelector);
  const gaiaLpBalance = useTotalLpBalance(ibcAssets[0]);
  const osmoLpBalance = useTotalLpBalance(ibcAssets[1]);
  const junoLPBalance = useTotalLpBalance(ibcAssets[2]);
  const totalLpBalance = Big(gaiaLpBalance)
    .add(osmoLpBalance)
    .add(junoLPBalance);
  const totalAsset = Big(totalAssetUSD).add(totalLpBalance);

  return (
    <div className="lg:max-w-6xl flex flex-wrap relative container mx-auto lg:px-24">
      <div className="text-center mb-5 w-full mx-auto lg:text-left lg:mx-0 lg:place-self-auto ">
        <h2 className="mb-2 md:text-4xl text-2xl text-yellow-500 font-semibold">
          My Supernova Assets
        </h2>
      </div>
      <div
        className={clsx(
          "w-full mx-auto",
          isMobile
            ? "grid grid-cols-2 items-center max-w-xl md:mb-8 mb-5"
            : "flex flex-wrap mb-10",
        )}
      >
        <AssetBox title="Total Assets">
          ${" "}
          {convertBalanceToLocaleString(
            totalAsset.toString(),
            MAXIMUM_DECIMAL_POINT,
          )}
        </AssetBox>
        <AssetBox title="Available Balance">
          $ {convertBalanceToLocaleString(totalAssetUSD, MAXIMUM_DECIMAL_POINT)}
        </AssetBox>
        <AssetBox title="Total LP Tokens">
          ${" "}
          {convertBalanceToLocaleString(
            totalLpBalance.toString(),
            MAXIMUM_DECIMAL_POINT,
          )}
        </AssetBox>
        <AssetBox title="Bonded NOVA">
          <>{parseNovaBalanceToLocaleString(totalBondedNova)} NOVA</>
        </AssetBox>
      </div>
    </div>
  );
};
export default Overview;
