export const NOVA_REST =
  process.env.NEXT_PUBLIC_NOVA_REST ||
  "https://champagne-rest.dev-supernova.xyz";

export const NOVA_RPC =
  process.env.NEXT_PUBLIC_NOVA_RPC ||
  "https://champagne-tendermint.dev-supernova.xyz";

export const REST_BASE_URL = NOVA_REST;

export const PRICE_FEEDER_BASE_URL =
  process.env.NEXT_PUBLIC_PRICE_FEEDER_BASE_URL || "http://price.supernova.ac";

export const COSMOS_RPC =
  process.env.NEXT_PUBLIC_COSMOS_RPC ||
  "https://champagne-cosmos-tendermint.dev-supernova.xyz";

export const OSMOSIS_RPC =
  process.env.NEXT_PUBLIC_OSMOSIS_RPC ||
  "https://champagne-osmosis-tendermint.dev-supernova.xyz";

export const JUNO_RPC =
  process.env.NEXT_PUBLIC_JUNO_RPC ||
  "https://champagne-juno-tendermint.dev-supernova.xyz";

export const COSMOS_REST =
  process.env.NEXT_PUBLIC_COSMOS_REST ||
  "https://champagne-cosmos-rest.dev-supernova.xyz/";

export const OSMOSIS_REST =
  process.env.NEXT_PUBLIC_OSMOSIS_REST ||
  "https://champagne-osmosis-rest.dev-supernova.xyz";

export const JUNO_REST =
  process.env.NEXT_PUBLIC_JUNO_REST ||
  "https://champagne-juno-rest.dev-supernova.xyz/";
