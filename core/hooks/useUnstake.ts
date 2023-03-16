import {
  getChainFromDenom,
  IBCAssetInfo,
  ibcAssets,
} from "core/config/ibcAssets";
import { unstakeAtom } from "core/state/stakeState";
import { nova } from "supernovajs";
import { coin } from "@cosmjs/stargate";
import executeNovaTx from "core/txs/executeNovaTx";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIBCAssets, useSnAssets } from "./useAssets";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { useEstimateSnAsset } from "./useEstimates";
import Big from "big.js";
import { ParseDecimal, trimTrailingZeros } from "core/utils/numberFormatter";
import { AssetWithAmount } from "core/utils/Asset";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";

export const useUnstake = () => {
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const [{ estimatedReturn, snAmount, selected }, setUnstakeStake] =
    useRecoilState(unstakeAtom);
  const { snAssets, refetchSnAssets } = useSnAssets();
  const { IBCAssets } = useIBCAssets();
  const [chainInfo, setChainInfo] = useState<IBCAssetInfo>(ibcAssets[0]);
  const { estimatedRatio } = useEstimateSnAsset(chainInfo);
  const [availableIBCAmount, setAvailableIBCAmount] = useState<string>("0");
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);

  useEffect(() => {
    if (snAssets.length > 0) {
      if (selected === null) {
        setUnstakeStake((prev) => {
          return {
            ...prev,
            selected: snAssets[0],
          };
        });
      } else {
        const prevSelected: AssetWithAmount = selected;
        const index =
          snAssets.findIndex(
            (updatedAsset) =>
              updatedAsset.assetComponent.denom ===
              prevSelected.assetComponent.denom,
          ) || 0;
        setUnstakeStake((prev) => {
          return {
            ...prev,
            selected: snAssets[index],
          };
        });
      }
    } else {
      setUnstakeStake((prev) => {
        return {
          ...prev,
          selected: null,
        };
      });
    }
  }, [setUnstakeStake, snAssets]);

  useEffect(() => {
    if (selected) {
      const chain = getChainFromDenom(selected?.assetComponent.denom);
      if (chain) {
        setChainInfo(chain);
      }
    }
  }, [selected]);

  useEffect(() => {
    const availableIBC = IBCAssets.find(
      (asset) =>
        asset.assetComponent.displayDenom ===
        chainInfo?.coinCurrencies.coinDenom,
    )?.getAmount();
    if (availableIBC) {
      setAvailableIBCAmount(availableIBC);
    } else {
      setAvailableIBCAmount("0");
    }
  }, [IBCAssets, chainInfo]);

  const setAmount = useCallback(
    (snAmount: string) => {
      const snAmountBig = Big(snAmount || 0).round(
        chainInfo.snCurrencies.coinDecimals || 0,
        Big.roundDown,
      );
      const estimatedReturn = estimatedRatio.eq(0)
        ? snAmountBig
        : snAmountBig.div(estimatedRatio);
      const parsedEstimatedReturn = trimTrailingZeros(
        estimatedReturn.toFixed(
          chainInfo.coinCurrencies.coinDecimals || 0,
          Big.roundDown,
        ),
      );

      setUnstakeStake((prev) => {
        return {
          ...prev,
          snAmount: snAmount,
          estimatedReturn: parsedEstimatedReturn,
        };
      });
    },
    [setUnstakeStake, chainInfo.snCurrencies.coinDecimals, estimatedRatio],
  );

  const setSelectedOption = (value: AssetWithAmount) => {
    setUnstakeStake((prev) => {
      return {
        ...prev,
        selected: value,
        snAmount: "",
        estimatedReturn: "0",
      };
    });
  };
  const executeUnstake = useCallback(async () => {
    if (novaClient && novaAddress) {
      setStatus({
        status: TransactionStatus.EXECUTING,
        type: TransactionType.UNSTAKE,
      });
      const { pendingUndelegate } = nova.gal.v1.MessageComposer.withTypeUrl;
      const msgUndelegate = pendingUndelegate({
        zoneId: chainInfo.counterpartyChainId,
        delegator: novaAddress,
        withdrawer: novaAddress,
        amount: coin(
          ParseDecimal(snAmount, chainInfo.snCurrencies.coinDecimals),
          chainInfo.snCurrencies.coinMinimalDenom,
        ),
      });

      const result = await executeNovaTx(
        msgUndelegate,
        novaClient,
        novaAddress,
      );
      if (!result) {
        setStatus({
          status: TransactionStatus.FAILED,
          type: TransactionType.UNSTAKE,
        });

        return;
      }

      setUnstakeStake((prev) => {
        return {
          ...prev,
          snAmount: "",
          estimatedReturn: "0",
        };
      });
      setStatus({
        status: TransactionStatus.SUCCESS,
        type: TransactionType.UNSTAKE,
      });

      refetchSnAssets();
      return result;
    }
  }, [
    chainInfo.counterpartyChainId,
    chainInfo.snCurrencies.coinDecimals,
    chainInfo.snCurrencies.coinMinimalDenom,
    novaAddress,
    novaClient,
    refetchSnAssets,
    setStatus,
    setUnstakeStake,
    snAmount,
  ]);

  return {
    executeUnstake,
    setAmount,
    setSelectedOption,
    estimatedReturn,
    snAmount,
    snAssets,
    availableIBCAmount,
    chainInfo,
    selected,
    estimatedRatio,
    transactionStatus,
    setStatus,
  };
};
