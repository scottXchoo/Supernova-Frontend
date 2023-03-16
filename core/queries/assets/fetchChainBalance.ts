import { SigningStargateClient } from "@cosmjs/stargate";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const fetchChainBalance = async (
  client: SigningStargateClient,
  address: string,
  denom: string,
): Promise<Coin | null> => {
  const balance = await client.getBalance(address, denom);
  return balance;
};

export default fetchChainBalance;
