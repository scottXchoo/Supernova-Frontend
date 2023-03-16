import Big from "big.js";
import useStakedLpTokens from "core/hooks/pools/useStakedLpTokens";
import * as gtag from "lib/gtag";
import { useSetRecoilState } from "recoil";
import { ActiveButton, MinusButton, PlusButton } from "./Button";
import {
  stakeLpModalAtom,
  unstakeLpModalAtom,
} from "core/state/pools/lpModalState";
import { InfoIcon } from "components/common/info";
import { PairInfo } from "core/config/pairInfo";
import { useLpDecimal, useTotalLpSupply } from "core/hooks/useLiquidity";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import useTotalPoolBalance from "core/hooks/pools/useTotalPoolBalance";
import { getShareOfPoolRatio } from "core/utils/poolUtil";

const MyPoolsInfoStakeLP = ({ pair }: { pair: PairInfo }) => {
  const setStakeLpModal = useSetRecoilState(stakeLpModalAtom);
  const setUnstakeLpModal = useSetRecoilState(unstakeLpModalAtom);
  const lpDecimal = useLpDecimal(pair.asset0.denom, pair.asset1.denom);

  const displayDenom = pair.asset0.denom;
  const displayShadowDenom = pair.asset1.denom;
  const totalPoolBalance = useTotalPoolBalance({
    displayDenom,
    displayShadowDenom,
  });

  const { data: stakedLpBalance } = useStakedLpTokens(pair);
  const stakedLpDisplayBalance = Big(stakedLpBalance?.amount || "0").div(
    Big(10).pow(lpDecimal),
  );
  const lpTotalSupply = useTotalLpSupply(pair.asset0.denom, pair.asset1.denom);
  const displayLpTotalSupply = lpTotalSupply.div(Big(10).pow(lpDecimal));
  const stakedLpShareOfPool = getShareOfPoolRatio(
    displayLpTotalSupply,
    stakedLpDisplayBalance,
  );
  const myStakedLiquidityBalance = totalPoolBalance.mul(stakedLpShareOfPool);

  const handleStakeLpModalButton = () => {
    gtag.event({
      action: "click-pools-stakeLp",
      category: "pools",
    });
    setStakeLpModal((prev) => {
      return {
        ...prev,
        isModalOpen: true,
        displayDenom: displayDenom,
        displayShadowDenom: displayShadowDenom,
      };
    });
  };

  const handleUnstakeLpModalButton = () => {
    gtag.event({
      action: "click-pools-unstakeLp",
      category: "pools",
    });
    setUnstakeLpModal((prev) => {
      return {
        ...prev,
        isModalOpen: true,
        displayDenom: displayDenom,
        displayShadowDenom: displayShadowDenom,
      };
    });
  };

  return (
    <>
      <div className="flex-initial col-span-5">
        <div className="flex items-center text-purple-500">
          <p className="md:text-xl font-medium text-left xl:text-lg text-sm md:mr-2 mr-1">
            My staked liquidity
          </p>
          <InfoIcon content="LP tokens must be staked to receive NOVA block rewards." />
        </div>
        <h3 className="text-black md:text-2xl text-lg text-left truncate font-semibold leading-tight xl:text-xl">
          $ {convertBigToFixedString(myStakedLiquidityBalance, lpDecimal)}
        </h3>
      </div>
      <div className="justify-end col-span-3 flex md:pl-4 pl-1.5 space-x-2">
        {stakedLpDisplayBalance.gt(0) ? (
          <>
            <PlusButton onClick={handleStakeLpModalButton} />
            <MinusButton onClick={handleUnstakeLpModalButton} />
          </>
        ) : (
          <ActiveButton content="Stake LP" onClick={handleStakeLpModalButton} />
        )}
      </div>
    </>
  );
};

export default MyPoolsInfoStakeLP;
