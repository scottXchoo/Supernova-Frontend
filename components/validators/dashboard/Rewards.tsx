import useRewards from "core/hooks/validators/useRewards";
import useRewardsMutation from "core/hooks/validators/useRewardsMutation";
import { getNovaAddress } from "core/state/coreState";
import React from "react";
import { useRecoilValue } from "recoil";
import {
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleString,
} from "../delegate/delegateUtils";
import RewardsClaimButton from "./RewardsClaimButton";

const Rewards = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: rewardsData, error: isRewardsError } = useRewards(novaAddress);
  const { mutate, isLoading } = useRewardsMutation();
  if (isRewardsError) return null;
  const handleClaimReward = () => {
    rewardsData != null &&
      mutate({
        rewards: rewardsData.rewards,
      });
  };

  return (
    <div className="lg:w-1/4 w-full md:mb-0 mb-2 md:px-2 px-1 flex justify-center lg:h-auto h-48">
      <div className="w-full bg-black bg-opacity-30 border border-gray-200 rounded-xl grid py-2 px-4">
        <div>
          <h4 className="lg:text-sm text-xs text-left font-medium border-b border-gray-200 px-2 text-gray-200 pb-1 mb-2">
            Claimable Rewards
          </h4>
          <div className="flex items-center justify-between px-2">
            <div className="grid">
              <div className="group grid justify-start">
                <p className="text-white font-semibold text-left text-xl md:text-2xl overflow-x-auto number-scroll-purple-auto">
                  {rewardsData != null
                    ? parseNovaBalanceToLocaleString(
                        rewardsData.totalRewards.amount,
                      )
                    : "0"}
                </p>
              </div>
              <p className="text-gray-700 text-xs text-left mr-1 px-1 truncate">
                ≈ ${DEFAULT_NUMBER_STRING}
              </p>
            </div>
            <span className="text-xs font-bold text-white -mt-4 ml-2">
              NOVA
            </span>
          </div>
        </div>
        <div className="w-full flex items-end py-2">
          <RewardsClaimButton
            isActive={!!rewardsData && rewardsData.totalRewards.amount !== "0"}
            isLoading={isLoading}
            onClick={handleClaimReward}
          />
        </div>
      </div>
    </div>
  );
};

export default Rewards;
