import { IBCAssetInfo } from "core/config/ibcAssets";
import { nova } from "supernovajs";
import executeNovaTx from "core/txs/executeNovaTx";
import { useCallback, useEffect, useState } from "react";
import { claimableAssetsQuery, depositAssetsQuery } from "core/selectors/claim";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import { calculateDisplayedAmount } from "core/utils/assetUtil";
import { useSnAssets } from "./useAssets";

export const useClaimSnAsset = (chainInfo: IBCAssetInfo) => {
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const chainId = chainInfo.counterpartyChainId;
  const claimableAssets = useRecoilValueLoadable(claimableAssetsQuery(chainId));
  const depositAssets = useRecoilValueLoadable(depositAssetsQuery(chainId));
  const refetchDepositAssets = useRecoilRefresher_UNSTABLE(
    depositAssetsQuery(chainId),
  );
  const refetchClaimableAssets = useRecoilRefresher_UNSTABLE(
    claimableAssetsQuery(chainId),
  );
  const { refetchSnAssets } = useSnAssets();
  const [claimableAmount, setClaimableAmount] = useState<string>("0");
  const [pendingDepositAmount, setPendingDepositAmount] = useState<string>("0");
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);

  useEffect(() => {
    if (claimableAssets.state === "hasValue") {
      setClaimableAmount(
        calculateDisplayedAmount(
          claimableAssets.contents,
          chainInfo.snCurrencies.coinDecimals,
        ),
      );
    } else if (claimableAssets.state === "hasError") {
      setClaimableAmount("0");
    }
  }, [chainInfo, claimableAssets]);

  useEffect(() => {
    if (depositAssets.state === "hasValue") {
      setPendingDepositAmount(
        calculateDisplayedAmount(
          depositAssets.contents,
          chainInfo.coinCurrencies.coinDecimals,
        ),
      );
    } else if (depositAssets.state === "hasError") {
      setPendingDepositAmount("0");
    }
  }, [depositAssets]);

  const claimSnAsset = useCallback(async () => {
    if (novaClient && novaAddress && chainInfo) {
      setStatus({
        status: TransactionStatus.EXECUTING,
        type: TransactionType.SNCLAIM,
      });
      const { claimSnAsset } = nova.gal.v1.MessageComposer.withTypeUrl;
      const msgClaimSnAsset = claimSnAsset({
        zoneId: chainInfo.counterpartyChainId,
        claimer: novaAddress,
        fromAddress: novaAddress,
      });

      const result = await executeNovaTx(
        msgClaimSnAsset,
        novaClient,
        novaAddress,
      );
      if (!result) {
        setStatus({
          status: TransactionStatus.FAILED,
          type: TransactionType.SNCLAIM,
        });

        return;
      }

      setStatus({
        status: TransactionStatus.IDLE,
        type: TransactionType.SNCLAIM,
      });
      refetchClaimableAssets();
      refetchDepositAssets();
      refetchSnAssets();
      return result;
    }
  }, [
    novaClient,
    novaAddress,
    chainInfo,
    setStatus,
    refetchClaimableAssets,
    refetchDepositAssets,
    refetchSnAssets,
  ]);

  return {
    claimSnAsset,
    refetchClaimableAssets,
    refetchDepositAssets,
    claimableAmount,
    pendingDepositAmount,
    chainInfo,
    transactionStatus,
  };
};
