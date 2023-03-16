export const SWAP_FEE = "0.3";
export const BOT_SUCCESS_STATE = "3";
export const DATE_FORMAT = "YYYY-MM-DD HH:mm";
export const BOT_PERIOD_UNIT = "minute";

export const MAXIMUM_DECIMAL_POINT = 6;
export const SNTOKEN_DECIMAL_POINT = 18;
export const NOVA_DECIMAL = 6;

export const GAIA_NOVA_REWARD =
  process.env.NEXT_PUBLIC_GAIA_NOVA_REWARD || "24";
export const OSMOSIS_NOVA_REWARD =
  process.env.NEXT_PUBLIC_OSMOSIS_NOVA_REWARD || "12";
export const JUNO_NOVA_REWARD = process.env.NEXT_PUBLIC_JUNO_NOVA_REWARD || "4";
export const TX_GAS_FEE = process.env.NEXT_PUBLIC_TX_GAS_FEE || "300000";
export const CONTRACT_GAS_FEE =
  process.env.NEXT_PUBLIC_CONTRACT_GAS_FEE || "2000000";
export const CONTRACT_GAS_AMOUNT =
  process.env.NEXT_PUBLIC_CONTRACT_GAS_AMOUNT || "2000";

export const PREFIX_SNU = "snu";
export const PREFIX_IBC = "ibc/";

export const APY_ZONE_NAME_NOVA = process.env.APY_ZONE_NAME_NOVA || "nova";
export const APY_ZONE_NAME_GAIA = process.env.APY_ZONE_NAME_GAIA || "gaia";
export const APY_ZONE_NAME_JUNO = process.env.APY_ZONE_NAME_JUNO || "juno";
export const APY_ZONE_NAME_OSMOSIS =
  process.env.APY_ZONE_NAME_OSMOSIS || "osmosis";

export const NOVA_CHAINID = process.env.NEXT_PUBLIC_NOVA_CHAINID || "nova";
export const NOVA_CHAIN_NAME =
  process.env.NEXT_PUBLIC_NOVA_CHAIN_NAME || "Supernova";
export const UNOVA_MINIMAL_DENOM = "unova";
export const NOVA_DISPLAY_DENOM = "NOVA";

export const COSMOS_CHAINID = process.env.NEXT_PUBLIC_COSMOS_CHAINID || "gaia";
export const OSMOSIS_CHAINID =
  process.env.NEXT_PUBLIC_OSMOSIS_CHAINID || "osmosis";
export const JUNO_CHAINID = process.env.NEXT_PUBLIC_JUNO_CHAINID || "juno";
export const USE_STUB_CHAIN = process.env.NEXT_PUBLIC_USE_STUB_CHAIN || true;

export const gaiaSourceChannelId =
  process.env.NEXT_PUBLIC_GAIA_SOURCE_CHANNEL || "channel-2";
export const gaiaDestChannelId =
  process.env.NEXT_PUBLIC_GAIA_DEST_CHANNEL || "channel-0";

export const osmoSourceChannelId =
  process.env.NEXT_PUBLIC_OSMO_SOURCE_CHANNEL || "channel-1";
export const osmoDestChannelId =
  process.env.NEXT_PUBLIC_OSMO_DEST_CHANNEL || "channel-0";

export const junoSourceChannelId =
  process.env.NEXT_PUBLIC_JUNO_SOURCE_CHANNEL || "channel-0";
export const junoDestChannelId =
  process.env.NEXT_PUBLIC_JUNO_DEST_CHANNEL || "channel-0";

export const gaiaUnbondingPeriod = Number(
  process.env.NEXT_PUBLIC_GAIA_UNBONDING_PERIOD || 21,
);
export const osmoUnbondingPeriod = Number(
  process.env.NEXT_PUBLIC_OSMO_UNBONDING_PERIOD || 14,
);
export const junoUnbondingPeriod = Number(
  process.env.NEXT_PUBLIC_JUNO_UNBONDING_PERIOD || 28,
);

export const botUnbondingPeriod = Number(
  process.env.NEXT_PUBLIC_BOT_UNBONDING_PERIOD || 3,
);

export const botDelegatePeriod = Number(
  process.env.NEXT_PUBLIC_BOT_DELEGATE_PERIOD || 10,
);

export const botOraclePeriod = Number(
  process.env.NEXT_PUBLIC_BOT_ORACLE_PERIOD || 15,
);

export const botAutoClaimPeriod = Number(
  process.env.NEXT_PUBLIC_BOT_AUTOCLAIM_PERIOD || 1,
);
