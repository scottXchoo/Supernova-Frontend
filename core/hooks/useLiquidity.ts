import { MsgComposer } from "./../utils/Swap";
import { balanceQuery, tokenInfoQuery } from "./../selectors/token";
import { poolQuery, pairQuery } from "./../selectors/pair";
import { useCallback, useEffect, useState } from "react";
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import {
  Asset,
  PoolResponse,
} from "supernovajs-contracts/types/codegen/Pair.types";
import {
  lpTokenAddressByDenoms,
  pairAddressByDenoms,
} from "core/utils/byDenomUtils";
import { executeContractTx } from "../txs/executeContractTx";
import { getNovaAddress, getWasmClient } from "../state/coreState";
import { contracts } from "supernovajs-contracts";
import { SigningCosmWasmClient } from "cosmwasm";
import { pairInfo } from "core/config/pairInfo";
import Big from "big.js";

export const useTotalLpSupply = (denom0: string, denom1: string): Big => {
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const pool = useRecoilValueLoadable(
    poolQuery(pairAddress || pairInfo[0].pairContractAddress),
  );

  useEffect(() => {
    if (pool.state === "hasValue") {
      setTotalSupply(pool.contents?.total_supply || "0");
    } else if (pool.state === "hasError") {
      setTotalSupply("0");
    }
  }, [pool]);

  return Big(totalSupply);
};

export const useLpBalance = (denom0: string, denom1: string) => {
  const [lpBalance, setLpBalance] = useState<string>();
  const lpTokenAddress = lpTokenAddressByDenoms(denom0, denom1);
  const balance = useRecoilValueLoadable(
    balanceQuery(lpTokenAddress || pairInfo[0].lpTokenContractAddress),
  );

  useEffect(() => {
    if (balance.state === "hasValue") {
      setLpBalance(balance.contents);
    } else if (balance.state === "hasError") {
      setLpBalance("0");
    }
  }, [balance]);
  return Big(lpBalance || "0");
};

export const usePooledAsset = (
  denom0: string,
  denom1: string,
): [Asset, Asset] | null => {
  const [pooledAsset, setPooledAsset] = useState<PoolResponse | null>();
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const pool = useRecoilValueLoadable(
    poolQuery(pairAddress || pairInfo[0].pairContractAddress),
  );

  useEffect(() => {
    if (pool.state === "hasValue") {
      setPooledAsset(pool?.contents);
    } else if (pool.state === "hasError") {
      setPooledAsset(null);
    }
  }, [pool]);
  return pooledAsset?.assets || null;
};

export const useLpTokenAddress = (denom0: string, denom1: string): string => {
  const [lpTokenAddress, setLpTokenAddress] = useState<string>();
  const pairAddress = pairAddressByDenoms(denom0, denom1);
  const pair = useRecoilValueLoadable(
    pairQuery(pairAddress || pairInfo[0].pairContractAddress),
  );

  useEffect(() => {
    if (pair.contents == null) {
      setLpTokenAddress(pairInfo[0].lpTokenContractAddress);
    } else {
      setLpTokenAddress(pair.contents.liquidity_token);
    }
  }, [pair]);
  return lpTokenAddress || pairInfo[0].lpTokenContractAddress;
};

export const useLpDecimal = (denom0: string, denom1: string) => {
  const [lpDecimal, setLpDecimal] = useState<number>(6);
  const lpAddress = lpTokenAddressByDenoms(denom0, denom1);
  const queryTokenInfo = useRecoilValueLoadable(
    tokenInfoQuery(lpAddress || pairInfo[0].lpTokenContractAddress),
  );

  useEffect(() => {
    if (queryTokenInfo.state === "hasValue") {
      setLpDecimal(queryTokenInfo?.contents?.decimals || 6);
    } else if (queryTokenInfo.state === "hasError") {
      setLpDecimal(6);
    }
  }, [lpDecimal]);
  return lpDecimal;
};

export const useLiquidity = (lpTokenAddress: string, pairAddress: string) => {
  const wasmClient = useRecoilValue(getWasmClient);
  const novaAddress = useRecoilValue(getNovaAddress);
  const refetchLpBalance = useRecoilRefresher_UNSTABLE(
    balanceQuery(lpTokenAddress),
  );
  const refetchPooledAsset = useRecoilRefresher_UNSTABLE(
    poolQuery(pairAddress),
  );

  const executeAddLiquidity = useCallback(
    async (asset0: MsgComposer, asset1: MsgComposer, pairAddress: string) => {
      if (!wasmClient || !novaAddress) {
        return null;
      }

      const pairMsgComposers = new contracts.Pair.PairMessageComposer(
        novaAddress,
        pairAddress,
      );
      const pairMsg = pairMsgComposers.provideLiquidity(
        {
          assets: [
            {
              amount: asset0.inputAmount,
              info: asset0.getInfo(),
            },
            {
              amount: asset1.inputAmount,
              info: asset1.getInfo(),
            },
          ],
        },
        [
          // TODO : refactoring
          asset0.getCoinInfo(),
          asset1.getCoinInfo(),
        ],
      );
      return executeContractTx(pairMsg, wasmClient, novaAddress);
    },
    [novaAddress, wasmClient],
  );

  const executeRemoveLiquidity = useCallback(
    async (
      denom0: string,
      denom1: string,
      lpTokenAddress: string,
      pairAddress: string,
      inputAmount: string,
      wasmClient?: SigningCosmWasmClient,
      novaAddress?: string,
    ) => {
      if (!wasmClient || !novaAddress) {
        return null;
      }

      const poolContractAddress = pairAddressByDenoms(denom0, denom1);
      if (poolContractAddress == null) {
        return;
      }
      const tokenMsgComposers = new contracts.Token.TokenMessageComposer(
        novaAddress,
        lpTokenAddress,
      );
      const withdrawMsg = {
        withdraw_liquidity: {},
      };
      const sendMsg = tokenMsgComposers.send(
        {
          amount: inputAmount,
          contract: pairAddress,
          msg: Buffer.from(JSON.stringify(withdrawMsg)).toString("base64"),
        },
        [],
      );
      return executeContractTx(sendMsg, wasmClient, novaAddress);
    },
    [],
  );
  return {
    executeAddLiquidity,
    executeRemoveLiquidity,
    refetchLpBalance,
    refetchPooledAsset,
  };
};
