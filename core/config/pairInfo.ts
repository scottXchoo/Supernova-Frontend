import { makeIBCMinimalDenom } from "core/utils/ibcUtils";
import { ibcAssets } from "./ibcAssets";

export interface AssetInfo {
  denom: string;
  img: string;
}

export interface PairInfo {
  denoms: [string, string];
  pairContractAddress: string;
  lpTokenContractAddress: string;
  vaultContractAddress: string;
  asset0: AssetInfo;
  asset1: AssetInfo;
}

if (
  !process.env.NEXT_PUBLIC_GAIA_PAIR_ADDRESS ||
  !process.env.NEXT_PUBLIC_GAIA_LP_ADDRESS ||
  !process.env.NEXT_PUBLIC_GAIA_VAULT_ADDRESS ||
  !process.env.NEXT_PUBLIC_OSMO_PAIR_ADDRESS ||
  !process.env.NEXT_PUBLIC_OSMO_LP_ADDRESS ||
  !process.env.NEXT_PUBLIC_OSMO_VAULT_ADDRESS ||
  !process.env.NEXT_PUBLIC_JUNO_PAIR_ADDRESS ||
  !process.env.NEXT_PUBLIC_JUNO_LP_ADDRESS ||
  !process.env.NEXT_PUBLIC_JUNO_VAULT_ADDRESS
) {
  throw new Error("Insufficient pair info given");
}

export const pairInfo: PairInfo[] = [
  // ATOM & snATOM
  {
    denoms: [
      makeIBCMinimalDenom(
        ibcAssets[0].sourceChannelId,
        ibcAssets[0].coinCurrencies.coinMinimalDenom,
      ),
      ibcAssets[0].snCurrencies.coinMinimalDenom,
    ],
    pairContractAddress: process.env.NEXT_PUBLIC_GAIA_PAIR_ADDRESS,
    lpTokenContractAddress: process.env.NEXT_PUBLIC_GAIA_LP_ADDRESS,
    vaultContractAddress: process.env.NEXT_PUBLIC_GAIA_VAULT_ADDRESS,
    asset0: {
      denom: "ATOM",
      img: "atom.svg",
    },
    asset1: {
      denom: "snATOM",
      img: "snAtom.svg",
    },
  },
  // OSMO & snOSMO
  {
    denoms: [
      makeIBCMinimalDenom(
        ibcAssets[1].sourceChannelId,
        ibcAssets[1].coinCurrencies.coinMinimalDenom,
      ),
      ibcAssets[1].snCurrencies.coinMinimalDenom,
    ],
    pairContractAddress: process.env.NEXT_PUBLIC_OSMO_PAIR_ADDRESS,
    lpTokenContractAddress: process.env.NEXT_PUBLIC_OSMO_LP_ADDRESS,
    vaultContractAddress: process.env.NEXT_PUBLIC_OSMO_VAULT_ADDRESS,
    asset0: {
      denom: "OSMO",
      img: "osmo.svg",
    },
    asset1: {
      denom: "snOSMO",
      img: "snOsmo.svg",
    },
  },
  // JUNO & snJUNO
  {
    denoms: [
      makeIBCMinimalDenom(
        ibcAssets[2].sourceChannelId,
        ibcAssets[2].coinCurrencies.coinMinimalDenom,
      ),
      ibcAssets[2].snCurrencies.coinMinimalDenom,
    ],
    pairContractAddress: process.env.NEXT_PUBLIC_JUNO_PAIR_ADDRESS,
    lpTokenContractAddress: process.env.NEXT_PUBLIC_JUNO_LP_ADDRESS,
    vaultContractAddress: process.env.NEXT_PUBLIC_JUNO_VAULT_ADDRESS,
    asset0: {
      denom: "JUNO",
      img: "juno.svg",
    },
    asset1: {
      denom: "snJUNO",
      img: "snJuno.svg",
    },
  },
];
