import { useStake } from "core/hooks/useStake";
import { useUnstake } from "core/hooks/useUnstake";
import { useWithdraw } from "core/hooks/useWithdraw";
import { useRouter } from "next/router";
export type DenomPair = {
  denom: string;
  snDenom: string;
}
export const Title = () => {
  const router = useRouter();
  const title = router.pathname.slice(1);
  const { chainInfo: stakeChainInfo } = useStake();
  const { chainInfo: unstakeChainInfo } = useUnstake();
  const { chainInfo: claimChainInfo } = useWithdraw();

  const getDenomPair = (title: string): DenomPair => {
    if (title === "stake") return { denom: stakeChainInfo.coinCurrencies.coinDenom, snDenom: stakeChainInfo.snCurrencies.coinDenom };
    else if (title === "unstake") return { denom: unstakeChainInfo.coinCurrencies.coinDenom, snDenom: unstakeChainInfo.snCurrencies.coinDenom };
    else {
      return { denom: claimChainInfo.coinCurrencies.coinDenom, snDenom: claimChainInfo.snCurrencies.coinDenom };
    }
  }

  const getDenomTitle = (title: string): string => {
    if (title === "stake") return stakeChainInfo.coinCurrencies.coinDenom;
    else if (title === "unstake") return unstakeChainInfo.snCurrencies.coinDenom;
    else {
      return claimChainInfo.coinCurrencies.coinDenom;
    }
  }

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="max-w-xl text-center md:mb-10 mb-5 mx-auto">
      <h2 className="mb-2 md:text-4xl text-3xl text-yellow-500 font-semibold">
        {capitalize(title)} {getDenomTitle(title)}
      </h2>
      <p className="text-sm text-white md:text-base">
        Stake {getDenomPair(title).denom} and use {getDenomPair(title).snDenom} while earning rewards
      </p>
    </div>
  );
};
