import { coin } from "@cosmjs/stargate";
import Big from "big.js";
import { convertBigToFixedString } from "./numberFormatter";

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

export class AssetComponent {
  constructor(
    public denom: string,
    public displayDenom: string,
    public decimal: number,
    public imgPath: string,
    public chainId: string,
  ) {
    this.denom = denom;
    this.displayDenom = displayDenom;
    this.decimal = decimal;
    this.imgPath = imgPath;
    this.chainId = chainId;
  }
}

export class AssetWithAmount {
  constructor(
    public assetComponent: AssetComponent,
    public amount: string,
    public pairCoinDenom?: string,
  ) {
    this.assetComponent = assetComponent;
    this.amount = amount;
  }

  getInfo() {
    return {
      native_token: {
        denom: this.assetComponent.denom,
      },
    };
  }

  assetInfoWithAmount(inputAmount: string): {
    amount: string;
    info: AssetInfo;
  } {
    return {
      amount: Big(inputAmount || 0).toFixed(0, Big.roundDown),
      info: this.getInfo(),
    };
  }

  getCoinInfo(inputAmount: string) {
    return coin(
      Big(inputAmount).toFixed(0, Big.roundDown),
      this.assetComponent.denom,
    );
  }

  getDisplayedAmount() {
    const amountBig = new Big(this.amount || 0);
    return amountBig.div(new Big(10).pow(this.assetComponent.decimal || 0));
  }

  getAmount() {
    const amount = this.getDisplayedAmount();
    const negativeExponent = this.assetComponent.decimal;

    return convertBigToFixedString(amount, negativeExponent);
  }
}
