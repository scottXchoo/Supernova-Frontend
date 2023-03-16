import { useEffect, useState } from "react";

export const useStakeNotice = () => {
  const STAKE_NOTICE = "STAKE_NOTICE";
  const UNSTAKE_NOTICE = "UNSTAKE_NOTICE";
  const CLAIM_NOTICE = "CLAIM_NOTICE";
  const [stakeNotice, setStakeNotice] = useState<boolean>(true);
  const [unstakeNotice, setUnstakeNotice] = useState<boolean>(true);
  const [claimNotice, setClaimNotice] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawStake = window.localStorage.getItem(STAKE_NOTICE);
      const rawUnstake = window.localStorage.getItem(UNSTAKE_NOTICE);
      const rawClaim = window.localStorage.getItem(CLAIM_NOTICE);
      if (rawStake) {
        const stakeValue = JSON.parse(rawStake);
        setStakeNotice(stakeValue);
      }
      if (rawUnstake) {
        const unstakeValue = JSON.parse(rawUnstake);
        setUnstakeNotice(unstakeValue);
      }
      if (rawClaim) {
        const claimValue = JSON.parse(rawClaim);
        setClaimNotice(claimValue);
      }
    }
  }, []);

  const setStake = (value: boolean) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STAKE_NOTICE, JSON.stringify(value));
    }
    setStakeNotice(value);
  };

  const setUnstake = (value: boolean) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(UNSTAKE_NOTICE, JSON.stringify(value));
    }
    setUnstakeNotice(value);
  };

  const setClaim = (value: boolean) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CLAIM_NOTICE, JSON.stringify(value));
    }
    setClaimNotice(value);
  };

  return {
    stakeNotice,
    unstakeNotice,
    claimNotice,
    setStake,
    setUnstake,
    setClaim,
  };
};
