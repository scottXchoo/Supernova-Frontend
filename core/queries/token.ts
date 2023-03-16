import { TokenQueryClient } from "supernovajs-contracts/types/codegen/Token.client";

export type QueryBalanceProps = {
  queryClient: TokenQueryClient;
  address: string;
};

export const queryBalance = async ({
  queryClient,
  address,
}: QueryBalanceProps) => {
  const tokenBalance = await queryClient.balance({ address: address });
  return tokenBalance.balance;
};

export type QueryTokenInfoProps = {
  queryClient: TokenQueryClient;
};

export const queryTokenInfo = async ({ queryClient }: QueryTokenInfoProps) => {
  const tokenInfo = await queryClient.tokenInfo();
  return tokenInfo;
};
