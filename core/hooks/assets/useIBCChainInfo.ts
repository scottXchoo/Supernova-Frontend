import { SigningStargateClient } from "@cosmjs/stargate";
import { getKeplrChainInfoFromChainId } from "core/config/chainInfo";
import { IBCAssetInfo } from "core/config/ibcAssets";
import { getChainFromIBCDenom } from "core/queries/assets";
import {
  chainClientIndices,
  chainClientAddresses,
  chainClientList,
} from "core/state/coreState";
import { useRecoilValue } from "recoil";
const IBC_TOKEN_DECIMAL = 6;

type IBCChainInfo = {
  client: SigningStargateClient;
  address: string;
  decimal: number;
  denom: string;
  minimalDenom: string;
  chainName: string;
  chainInfo: IBCAssetInfo | null;
  rpc: string;
};
const useIBCChainInfo = (denom: string): IBCChainInfo => {
  const chainInfo = getChainFromIBCDenom(denom) || null;
  const indices = useRecoilValue(chainClientIndices);
  const addresses = useRecoilValue(chainClientAddresses);
  const chainClients = useRecoilValue(chainClientList);
  const chainId = chainInfo?.counterpartyChainId || "";
  const chainIndex = indices[chainId];
  const address = addresses[chainIndex];
  const client = chainClients[chainIndex];
  const decimal = chainInfo?.coinCurrencies.coinDecimals || IBC_TOKEN_DECIMAL;
  const minimalDenom = chainInfo?.coinCurrencies.coinMinimalDenom || "";
  const chainName = getKeplrChainInfoFromChainId(chainId)?.chainName || "";
  const rpc = getKeplrChainInfoFromChainId(chainId)?.rpc || "";
  return {
    client,
    address,
    decimal,
    denom,
    minimalDenom,
    chainName,
    chainInfo,
    rpc,
  };
};

export default useIBCChainInfo;
