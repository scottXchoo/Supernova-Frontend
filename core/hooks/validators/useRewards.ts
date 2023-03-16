import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import fetchRewards, {
  RewardInfo,
  Rewards,
} from "core/queries/validators/fetchRewards";
import { useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useResetRecoilState } from "recoil";
import {
  rewardFamily,
  rewardValidatorAddressesAtom,
} from "core/state/validators/rewards";

const useRewards = (address: string): FetchResult<Rewards | undefined> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["rewards", address],
    queryFn: () => fetchRewards(address),
    enabled: !!address,
  });

  const rewardValidatorAddresses = useRecoilValue(rewardValidatorAddressesAtom);
  const resetRewardValidatorAddresses = useResetRecoilState(
    rewardValidatorAddressesAtom,
  );
  const updateRewards = useRecoilCallback(
    ({ set }) =>
      (reward: RewardInfo) => {
        set(rewardValidatorAddressesAtom, (prev) => [
          ...new Set([...prev, reward.validatorAddress]),
        ]);
        set(rewardFamily(reward.validatorAddress), reward.reward);
      },
    [],
  );
  const resetRewards = useRecoilCallback(
    ({ set }) =>
      (address: string) => {
        set(rewardFamily(address), null);
      },
    [],
  );
  useEffect(() => {
    if (data) {
      rewardValidatorAddresses.forEach((address) => resetRewards(address));
      resetRewardValidatorAddresses();
      data.rewards.forEach((reward) => updateRewards(reward));
    }
  }, [data, resetRewardValidatorAddresses, resetRewards, updateRewards]);

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }

  return {
    data,
    isLoading,
    error: null,
  };
};

export default useRewards;
