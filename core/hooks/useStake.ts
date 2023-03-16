import {
  getChainFromDenom,
  IBCAssetInfo,
  ibcAssets,
} from "core/config/ibcAssets";
import { stakeAtom } from "core/state/stakeState";
import { nova } from "supernovajs";
import { coin } from "@cosmjs/stargate";
import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import executeNovaTx from "core/txs/executeNovaTx";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIBCAssets, useSnAssets } from "./useAssets";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import { useEstimateSnAsset } from "./useEstimates";
import { AssetWithAmount } from "core/utils/Asset";
import Big from "big.js";
import { ParseDecimal, trimTrailingZeros } from "core/utils/numberFormatter";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import { defaultChainInfo } from "core/config/chainInfo";
import { useClaimSnAsset } from "./useClaimSnAsset";
import useMoveScroll from "./useMoveScroll";
import { Long } from "@osmonauts/helpers";
import traceIBCTransfer from "./assets/traceIBCTransfer";

const DEPOSIT_TIMEOUT = 10;
export const useStake = () => {
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const [{ amount, estimatedReturn, selected }, setStakeState] =
    useRecoilState(stakeAtom);
  const { IBCAssets, refetchIBCAssets } = useIBCAssets();
  const { snAssets } = useSnAssets();
  const [chainInfo, setChainInfo] = useState<IBCAssetInfo>(ibcAssets[0]);
  const { estimatedRatio } = useEstimateSnAsset(chainInfo);
  const swapEstimatedRatio = Big(0.8); //temp data
  const isBetterOnSwap = estimatedRatio.gt(swapEstimatedRatio);
  const [availableSnAmount, setAvailableSnAmount] = useState<string>("0");
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);
  const { refetchDepositAssets, refetchClaimableAssets } =
    useClaimSnAsset(chainInfo);
  const { element, onMoveToElement } = useMoveScroll();
  useEffect(() => {
    if (IBCAssets.length > 0) {
      if (selected === null) {
        setStakeState((prev) => {
          return {
            ...prev,
            selected: IBCAssets[0],
          };
        });
      } else {
        const prevSelected: AssetWithAmount = selected;
        const index =
          IBCAssets.findIndex(
            (updatedAsset) =>
              updatedAsset.assetComponent.denom ===
              prevSelected.assetComponent.denom,
          ) || 0;
        setStakeState((prev) => {
          return {
            ...prev,
            selected: IBCAssets[index],
          };
        });
      }
    } else {
      setStakeState((prev) => {
        return {
          ...prev,
          selected: null,
        };
      });
    }
  }, [IBCAssets, setStakeState]);

  useEffect(() => {
    refetchClaimableAssets();
    refetchDepositAssets();
  }, [chainInfo]); //bad...will deleted when use react-query...

  useEffect(() => {
    if (selected) {
      const chain = getChainFromDenom(selected?.assetComponent.displayDenom);
      if (chain) {
        setChainInfo(chain);
      }
    }
  }, [selected]);

  useEffect(() => {
    const availableSn = snAssets
      .find((asset) => asset.assetComponent.denom === selected?.pairCoinDenom)
      ?.getAmount();

    if (availableSn) {
      setAvailableSnAmount(availableSn);
    } else {
      setAvailableSnAmount("0");
    }
  }, [chainInfo, selected?.pairCoinDenom, snAssets]);

  const setAmount = useCallback(
    (amount: string) => {
      const amountBig = Big(amount || 0).round(
        chainInfo.coinCurrencies.coinDecimals || 0,
        Big.roundDown,
      );
      const estimatedReturn = estimatedRatio.mul(amountBig);
      const parsedEstimatedReturn = trimTrailingZeros(
        estimatedReturn.toFixed(
          chainInfo.snCurrencies.coinDecimals || 0,
          Big.roundDown,
        ),
      );

      setStakeState((prev) => {
        return {
          ...prev,
          amount: amount,
          estimatedReturn: parsedEstimatedReturn,
        };
      });
    },
    [setStakeState, estimatedRatio, chainInfo],
  );

  const setSelectedOption = (value: AssetWithAmount) => {
    setStakeState((prev) => {
      return {
        ...prev,
        selected: value,
        amount: "",
        estimatedReturn: "0",
      };
    });
  };

  const executeStake = useCallback(async () => {
    if (novaClient && novaAddress) {
      setStatus({
        status: TransactionStatus.EXECUTING,
        type: TransactionType.STAKE,
      });
      const { deposit } = nova.gal.v1.MessageComposer.withTypeUrl;
      const msgDeposit = deposit({
        depositor: novaAddress,
        amount: coin(
          ParseDecimal(amount, chainInfo.coinCurrencies.coinDecimals),
          makeIBCMinimalDenom(
            chainInfo?.sourceChannelId,
            chainInfo?.coinCurrencies.coinMinimalDenom,
          ),
        ),
        zoneId: chainInfo.counterpartyChainId,
        claimer: novaAddress,
        timeoutTimestamp: new Long(DEPOSIT_TIMEOUT),
      });

      const result = await executeNovaTx(msgDeposit, novaClient, novaAddress);
      if (!result) {
        setStatus({
          status: TransactionStatus.FAILED,
          type: TransactionType.STAKE,
        });

        return;
      }

      setStakeState((prev) => {
        return {
          ...prev,
          amount: "",
          estimatedReturn: "0",
        };
      });
      setStatus({
        status: TransactionStatus.SUCCESS,
        type: TransactionType.STAKE,
      });

      traceIBCTransfer(defaultChainInfo.rpc, result, () => {
        refetchDepositAssets();
        setStatus({
          status: TransactionStatus.IDLE,
          type: TransactionType.STAKE,
        });
        onMoveToElement();

        refetchIBCAssets();
      });

      return result;
    }
  }, [
    amount,
    chainInfo.coinCurrencies.coinDecimals,
    chainInfo.coinCurrencies.coinMinimalDenom,
    chainInfo.counterpartyChainId,
    chainInfo?.sourceChannelId,
    novaAddress,
    novaClient,
    onMoveToElement,
    refetchDepositAssets,
    refetchIBCAssets,
    setStakeState,
    setStatus,
  ]);

  return {
    executeStake,
    setAmount,
    setSelectedOption,
    setStatus,
    amount,
    estimatedReturn,
    IBCAssets,
    availableSnAmount,
    chainInfo,
    selected,
    estimatedRatio,
    transactionStatus,
    isBetterOnSwap,
    swapEstimatedRatio,
    element,
  };
};
