import {
  COSMOS_CHAINID,
  JUNO_CHAINID,
  NOVA_CHAINID,
  NOVA_CHAIN_NAME,
  NOVA_DECIMAL,
  NOVA_DISPLAY_DENOM,
  OSMOSIS_CHAINID,
  UNOVA_MINIMAL_DENOM,
  USE_STUB_CHAIN,
} from "core/constants/constants";
import {
  NOVA_RPC,
  NOVA_REST,
  COSMOS_RPC,
  OSMOSIS_RPC,
  JUNO_RPC,
  COSMOS_REST,
  OSMOSIS_REST,
  JUNO_REST,
} from "core/constants/urlConstants";

export interface Coin {
  readonly coinDenom: string;
  readonly coinMinimalDenom: string;
  readonly coinDecimals: number;
}

export interface CoinMetadata {
  readonly iconImagePath?: string;
}

export type CoinInfo = Coin & CoinMetadata;

export interface ChainInfo {
  readonly chainId: string;
  readonly chainName: string;
  readonly rpc: string;
  readonly rest: string;
  readonly bip44: {
    coinType: number;
  };
  readonly stakeCurrency: CoinInfo;
  readonly currencies: CoinInfo[];
  readonly feeCurrencies: (CoinInfo & {
    readonly gasPriceStep?: {
      low: number;
      average: number;
      high: number;
    };
  })[];
  readonly bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  // if this chain is not listed in keplr wallet, we need to suggest this chain to the wallet.
  readonly needChainSuggestion: boolean;
}

const useStubChain: boolean =
  typeof USE_STUB_CHAIN === "string"
    ? JSON.parse(USE_STUB_CHAIN)
    : USE_STUB_CHAIN;
export const defaultChainInfo: ChainInfo = {
  chainId: NOVA_CHAINID,
  chainName: NOVA_CHAIN_NAME,
  rpc: NOVA_RPC,
  rest: NOVA_REST,
  stakeCurrency: {
    coinDenom: NOVA_DISPLAY_DENOM,
    coinMinimalDenom: UNOVA_MINIMAL_DENOM,
    coinDecimals: NOVA_DECIMAL,
  },
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "nova",
    bech32PrefixAccPub: "novapub",
    bech32PrefixValAddr: "novavaloper",
    bech32PrefixValPub: "novavaloperpub",
    bech32PrefixConsAddr: "novavalcons",
    bech32PrefixConsPub: "novavalconspub",
  },
  currencies: [
    {
      coinDenom: NOVA_DISPLAY_DENOM,
      coinMinimalDenom: UNOVA_MINIMAL_DENOM,
      coinDecimals: NOVA_DECIMAL,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: NOVA_DISPLAY_DENOM,
      coinMinimalDenom: UNOVA_MINIMAL_DENOM,
      coinDecimals: NOVA_DECIMAL,
    },
  ],
  needChainSuggestion: true,
};

export const ibcChainInfo: ChainInfo[] = [
  {
    chainId: COSMOS_CHAINID,
    chainName: "Cosmos Hub",
    rpc: COSMOS_RPC,
    rest: COSMOS_REST,
    stakeCurrency: {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "cosmos",
      bech32PrefixAccPub: "cosmospub",
      bech32PrefixValAddr: "cosmosvaloper",
      bech32PrefixValPub: "cosmosvaloperpub",
      bech32PrefixConsAddr: "cosmosvalcons",
      bech32PrefixConsPub: "cosmosvalconspub",
    },
    currencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "ATOM",
        coinMinimalDenom: "uatom",
        coinDecimals: 6,
      },
    ],
    needChainSuggestion: useStubChain,
  },
  {
    chainId: OSMOSIS_CHAINID,
    chainName: "Osmosis",
    rpc: OSMOSIS_RPC,
    rest: OSMOSIS_REST,
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "osmo",
      bech32PrefixAccPub: "osmopub",
      bech32PrefixValAddr: "osmovaloper",
      bech32PrefixValPub: "osmovaloperpub",
      bech32PrefixConsAddr: "osmovalcons",
      bech32PrefixConsPub: "osmovalconspub",
    },
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0.025,
        },
      },
    ],

    needChainSuggestion: useStubChain,
  },
  {
    chainId: JUNO_CHAINID,
    chainName: "Juno",
    rpc: JUNO_RPC,
    rest: JUNO_REST,
    stakeCurrency: {
      coinDenom: "JUNO",
      coinMinimalDenom: "ujuno",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub",
    },
    currencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0.025,
        },
      },
    ],

    needChainSuggestion: useStubChain,
  },
];

export const chainInfoList: ChainInfo[] = [defaultChainInfo].concat(
  ibcChainInfo,
);

export const getKeplrChainInfoFromChainId = (
  chainId: string,
): ChainInfo | undefined => {
  for (const asset of chainInfoList) {
    if (asset.chainId === chainId) return asset;
  }
};
