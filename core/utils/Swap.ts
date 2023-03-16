/* eslint-disable no-prototype-builtins */
import { Asset } from "supernovajs-contracts/types/codegen/Pair.types";
import { coin } from "@cosmjs/stargate";
import Big from "big.js";

type TokenInfo = {
  token: {
    contract_addr: string;
    [k: string]: unknown;
  };
};

type NativeTokenInfo = {
  native_token: {
    denom: string;
    [k: string]: unknown;
  };
};

type AssetInfo = TokenInfo | NativeTokenInfo;

export class PoolAsset {
  constructor(public asset: [Asset, Asset], public denom: string) {
    this.asset = asset;
    this.denom = denom;
  }

  isNativeToken(o: any): o is NativeTokenInfo {
    return o && o.hasOwnProperty("native_token");
  }

  isContractToken(o: any): o is TokenInfo {
    return o && o.hasOwnProperty("token");
  }

  decideAssetType(x: AssetInfo) {
    if (this.isContractToken(x)) {
      return x.token.contract_addr;
    } else {
      return x.native_token.denom;
    }
  }

  displayedAmount0(x: number) {
    const amountBig = new Big(this.asset[0].amount);
    return amountBig.div(new Big(10).pow(x || 0));
  }

  displayedAmount1(x: number) {
    const amountBig = new Big(this.asset[1].amount);
    return amountBig.div(new Big(10).pow(x || 0));
  }
}

export class MsgComposer {
  constructor(public denom: string, public inputAmount: string) {
    this.denom = denom;
    this.inputAmount = inputAmount;
  }

  getInfo() {
    return {
      native_token: {
        denom: this.denom,
      },
    };
  }

  getCoinInfo() {
    return coin(Big(this.inputAmount).toFixed(0, Big.roundDown), this.denom);
  }
}
