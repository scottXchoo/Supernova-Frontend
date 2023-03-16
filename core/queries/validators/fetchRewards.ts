import { Coin } from "@cosmjs/stargate";
import { NOVA_REST } from "core/constants/urlConstants";
import { UNOVA_MINIMAL_DENOM } from "core/constants/constants";

export type Rewards = {
  totalRewards: Coin;
  rewards: RewardInfo[];
};

export type RewardInfo = {
  reward: Coin;
  validatorAddress: string;
};

export type RewardResponse = {
  reward: Coin[];
  validator_address: string;
};
const fetchRewards = async (novaAddress: string): Promise<Rewards | null> => {
  const fetchResult = await fetch(
    `${NOVA_REST}/cosmos/distribution/v1beta1/delegators/${novaAddress}/rewards`,
  );

  const data = await fetchResult.json();

  if (data.total.length === 0 || data.rewards.length === 0) {
    return {
      totalRewards: {
        amount: "0",
        denom: UNOVA_MINIMAL_DENOM,
      },
      rewards: [],
    };
  }
  const rewards: RewardInfo[] = data.rewards.map((reward: RewardResponse) => {
    return {
      reward: reward.reward[0],
      validatorAddress: reward.validator_address,
    };
  });
  const totalRewards = data.total[0];
  return {
    totalRewards,
    rewards,
  };
};

export default fetchRewards;
