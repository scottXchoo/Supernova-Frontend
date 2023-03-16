import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import fetchDelegation from "core/queries/validators/fetchDelegation";
import { delegationSelectorFamily } from "core/state/validators/delegate/delegation";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

const useDelegation = (
  delegatorAddress: string,
  validatorAddress: string,
): FetchResult<Coin | null> => {
  const [delegation, setDelegation] = useRecoilState(
    delegationSelectorFamily(validatorAddress),
  );
  const { data, error, isLoading } = useQuery({
    queryKey: ["delegation", delegatorAddress, validatorAddress],
    queryFn: () => fetchDelegation(delegatorAddress, validatorAddress),
    initialData: delegation,
    enabled: !!(delegatorAddress && validatorAddress),
  });

  useEffect(() => {
    if (data) setDelegation(data);
  }, [data]);

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }

  return {
    data,
    isLoading: false,
    error: null,
  };
};

export default useDelegation;
