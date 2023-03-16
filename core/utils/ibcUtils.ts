import { Buffer } from "buffer";
import { Hash } from "@keplr-wallet/crypto";
import { ibcAssets } from "core/config/ibcAssets";
import { PREFIX_IBC } from "../constants/constants";

export function makeIBCMinimalDenom(
  sourceChannelId: string,
  coinMinimalDenom: string,
): string {
  return (
    PREFIX_IBC +
    Buffer.from(
      Hash.sha256(
        Buffer.from(`transfer/${sourceChannelId}/${coinMinimalDenom}`),
      ),
    )
      .toString("hex")
      .toUpperCase()
  );
}

export const ibcDenomToNative = (ibcDenom: string) => {
  if (ibcDenom === undefined) return "";
  const IBCToken = ibcAssets.find(
    (ibcAsset) =>
      makeIBCMinimalDenom(
        ibcAsset.sourceChannelId,
        ibcAsset.coinCurrencies.coinMinimalDenom,
      ) == ibcDenom,
  );
  if (IBCToken) {
    return IBCToken.coinCurrencies.coinMinimalDenom;
  }
  return undefined;
};
