import { useQuery } from "@tanstack/react-query";
import Big from "big.js";
import { getChainFromDenom } from "core/config/ibcAssets";
import { getChainFromIBCDenom } from "core/queries/assets";
import fetchUserBalanceList from "core/queries/fetchUserBalanceList";
import {
  NOVA_DECIMAL,
  NOVA_DISPLAY_DENOM,
  PREFIX_IBC,
  UNOVA_MINIMAL_DENOM,
} from "core/constants/constants";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import { useRecoilCallback, useRecoilValue } from "recoil";
import {
  assetDisplayDenomList,
  assetFamily,
  getAllAssetsSelector,
} from "core/state/assets/assets";
import { useEffect } from "react";

export type BalanceData = {
  denom: string;
  displayDenom: string;
  amount: string;
};

const useUserBalanceList = (address: string) => {
  const {
    data: allBalances,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["allBalance", address],
    queryFn: () => fetchUserBalanceList(address),
    enabled: !!address,
    refetchInterval: 3000,
  });

  const userBalanceList = useRecoilValue(getAllAssetsSelector);
  const displayDenomList = useRecoilValue(assetDisplayDenomList);
  const updateAsset = useRecoilCallback(
    ({ set }) =>
      (balance: BalanceData) => {
        set(assetFamily(balance.displayDenom), balance);
      },
    [],
  );

  const resetAsset = useRecoilCallback(
    ({ set }) =>
      (displayDenom: string) => {
        set(assetFamily(displayDenom), null);
      },
    [],
  );

  useEffect(() => {
    displayDenomList.forEach((displayDenom) => resetAsset(displayDenom));
    if (!allBalances) return;
    allBalances.forEach((balance) => {
      if (balance.denom.startsWith(PREFIX_IBC)) {
        const ibcChainInfo = getChainFromIBCDenom(balance.denom);
        if (!ibcChainInfo) return null;
        const decimal = ibcChainInfo.coinCurrencies.coinDecimals;
        const amount = convertBigToFixedString(
          Big(balance.amount).div(new Big(10).pow(decimal)),
          decimal,
        );
        const balanceData: BalanceData = {
          amount: amount,
          denom: balance.denom,
          displayDenom: ibcChainInfo.coinCurrencies.coinDenom,
        };
        updateAsset(balanceData);
      } else if (balance.denom === UNOVA_MINIMAL_DENOM) {
        const amount = convertBigToFixedString(
          Big(balance.amount).div(new Big(10).pow(NOVA_DECIMAL)),
          NOVA_DECIMAL,
        );
        const balanceData: BalanceData = {
          amount: amount,
          denom: UNOVA_MINIMAL_DENOM,
          displayDenom: NOVA_DISPLAY_DENOM,
        };
        updateAsset(balanceData);
      } else {
        const snChainInfo = getChainFromDenom(balance.denom);
        if (!snChainInfo) return null;
        const decimal = snChainInfo.snCurrencies.coinDecimals;
        const amount = convertBigToFixedString(
          Big(balance.amount).div(new Big(10).pow(decimal)),
          decimal,
        );
        const balanceData: BalanceData = {
          amount: amount,
          denom: balance.denom,
          displayDenom: snChainInfo.snCurrencies.coinDenom,
        };
        updateAsset(balanceData);
      }
    });
  }, [allBalances, displayDenomList, resetAsset, updateAsset]);

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
    data: userBalanceList,
    isLoading,
    error: null,
  };
};

export default useUserBalanceList;
