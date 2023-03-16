import { getChainFromDenom, ibcAssets } from "core/config/ibcAssets";
import { withdrawAtom } from "core/state/stakeState";
import { nova } from "supernovajs";
import executeNovaTx from "core/txs/executeNovaTx";
import { useCallback, useEffect, useState } from "react";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { getNovaAddress, getNovaClient } from "core/state/coreState";
import {
  pendingWithdrawalsQuery,
  withdrawableQuery,
  withdrawRecordQuery,
} from "core/selectors/withdraw";
import {
  TransactionStatus,
  transactionStatusAtom,
  TransactionType,
} from "core/state/transaction";
import { AssetComponent, AssetWithAmount } from "core/utils/Asset";
import Big from "big.js";
import { useIBCAssets } from "./useAssets";
import { convertBigToFixedString } from "core/utils/numberFormatter";

export type RecordType = {
  asset: AssetWithAmount;
  completionTime: string;
};
export type WithDrawRecordObjectType = {
  records: Array<RecordType>;
  totalAmount: AssetWithAmount | null;
};
export const useWithdraw = () => {
  const novaClient = useRecoilValue(getNovaClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const [{ denom }, setWithdrawState] = useRecoilState(withdrawAtom);
  const chainInfo = getChainFromDenom(denom) || ibcAssets[0];
  const zoneId = chainInfo?.counterpartyChainId;
  const withdrawable = useRecoilValueLoadable(withdrawableQuery(denom));
  const peindingWithdrawals = useRecoilValueLoadable(
    pendingWithdrawalsQuery(denom),
  );
  const withdrawRecord = useRecoilValueLoadable(withdrawRecordQuery(denom));
  const refreshWithdrawRecord = useRecoilRefresher_UNSTABLE(
    withdrawRecordQuery(denom),
  );
  const refreshWithdrawable = useRecoilRefresher_UNSTABLE(
    withdrawableQuery(denom),
  );
  const refreshPendingWithdrwals = useRecoilRefresher_UNSTABLE(
    pendingWithdrawalsQuery(denom),
  );
  const { refetchIBCAssets } = useIBCAssets();
  const [withdrawableAmount, setWithdrawableAmount] = useState<string>("0");
  const [pendingWithdrawalsAmount, setPendingWithdrawlsAmount] =
    useState<string>("0");
  const [withdrawRecordObject, setWithdrawRecordObject] =
    useState<WithDrawRecordObjectType>({ records: [], totalAmount: null });
  const [transactionStatus, setStatus] = useRecoilState(transactionStatusAtom);

  useEffect(() => {
    if (withdrawRecord.state === "hasValue") {
      const records: Array<RecordType> = [];
      let totalAmount: Big = Big(0);
      Object.values(withdrawRecord.contents).map(
        (value: { completion_time: string; amount: string }) => {
          records.push({
            asset: new AssetWithAmount(
              new AssetComponent(
                denom,
                chainInfo.coinCurrencies.coinDenom,
                chainInfo?.coinCurrencies.coinDecimals,
                chainInfo.coinImagePath,
                chainInfo?.counterpartyChainId,
              ),
              value.amount,
            ),
            completionTime: value.completion_time,
          });
          totalAmount = totalAmount.add(Big(value.amount));
        },
      );

      setWithdrawRecordObject({
        records: records,
        totalAmount: new AssetWithAmount(
          new AssetComponent(
            denom,
            chainInfo.coinCurrencies.coinDenom,
            chainInfo?.coinCurrencies.coinDecimals,
            chainInfo.coinImagePath,
            chainInfo?.counterpartyChainId,
          ),
          convertBigToFixedString(totalAmount, 6),
        ),
      });
    } else if (withdrawRecord.state === "hasError") {
      setWithdrawRecordObject({ records: [], totalAmount: null });
    }
  }, [chainInfo, withdrawRecord]);

  useEffect(() => {
    if (withdrawable.state === "hasValue") {
      setWithdrawableAmount(withdrawable.contents.getAmount());
    } else if (withdrawable.state === "hasError") {
      setWithdrawableAmount("0");
    }
  }, [withdrawable]);

  useEffect(() => {
    if (peindingWithdrawals.state === "hasValue") {
      setPendingWithdrawlsAmount(peindingWithdrawals.contents.getAmount());
    } else if (peindingWithdrawals.state === "hasError") {
      setPendingWithdrawlsAmount("0");
    }
  }, [peindingWithdrawals]);

  const setDenom = (denom: string) => {
    setWithdrawState((prev) => {
      return {
        ...prev,
        denom: denom,
      };
    });
  };

  useEffect(() => {
    refreshWithdrawable();
    refreshPendingWithdrwals();
    refreshWithdrawRecord();
  }, [denom]);

  const withdraw = useCallback(async () => {
    if (novaClient && novaAddress && zoneId) {
      setStatus({
        status: TransactionStatus.EXECUTING,
        type: TransactionType.CLAIM,
      });
      const { withdraw } = nova.gal.v1.MessageComposer.withTypeUrl;

      const msgWithdraw = withdraw({
        zoneId: zoneId,
        withdrawer: novaAddress,
        fromAddress: novaAddress,
      });

      const result = await executeNovaTx(msgWithdraw, novaClient, novaAddress);
      if (!result) {
        setStatus({
          status: TransactionStatus.FAILED,
          type: TransactionType.CLAIM,
        });

        return;
      }

      setStatus({
        status: TransactionStatus.IDLE,
        type: TransactionType.CLAIM,
      });
      refreshWithdrawable();
      refreshPendingWithdrwals();
      refetchIBCAssets();
      return result;
    }
  }, [
    novaClient,
    novaAddress,
    zoneId,
    setStatus,
    refreshWithdrawable,
    refreshPendingWithdrwals,
    refetchIBCAssets,
  ]);

  return {
    withdraw,
    setDenom,
    withdrawableAmount,
    denom,
    pendingWithdrawalsAmount,
    chainInfo,
    transactionStatus,
    withdrawRecordObject,
  };
};
