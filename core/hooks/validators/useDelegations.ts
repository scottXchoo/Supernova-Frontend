import { FetchResult } from "../proposal/type";
import { useQuery } from "@tanstack/react-query";
import {
  delegatedValidatorAddressesAtom,
  delegationFamily,
  totalDelegationAtom,
} from "core/state/validators/delegate/delegation";
import {
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { useEffect } from "react";
import fetchDelegations, {
  Delegation,
} from "core/queries/validators/fetchDelegations";
import Big from "big.js";

const useDelegations = (
  delegatorAddress: string,
): FetchResult<Delegation[] | null> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["delegations", delegatorAddress],
    queryFn: () => fetchDelegations(delegatorAddress),
    enabled: !!delegatorAddress,
  });
  const delegationValidatorAddresses = useRecoilValue(
    delegatedValidatorAddressesAtom,
  );
  const resetDelegationValidatorAddresses = useResetRecoilState(
    delegatedValidatorAddressesAtom,
  );
  const resetTotalDelegationAmount = useResetRecoilState(totalDelegationAtom);
  const setTotalDelegationAmount = useSetRecoilState(totalDelegationAtom);

  const updateDelegations = useRecoilCallback(
    ({ set }) =>
      (delegation: Delegation) => {
        set(delegatedValidatorAddressesAtom, (prev) => [
          ...new Set([...prev, delegation.validatorAddress]),
        ]);
        set(delegationFamily(delegation.validatorAddress), delegation.balance);
      },
    [],
  );

  const resetDelegations = useRecoilCallback(
    ({ set }) =>
      (address: string) => {
        set(delegationFamily(address), null);
      },
    [],
  );

  useEffect(() => {
    delegationValidatorAddresses.forEach((address) =>
      resetDelegations(address),
    );
    resetTotalDelegationAmount();
    resetDelegationValidatorAddresses();
    if (data) {
      let totalDelegation = Big(0);

      const copiedData = [...data];
      copiedData.sort((a: Delegation, b: Delegation) => {
        return Number(b.balance.amount) - Number(a.balance.amount);
      });
      copiedData.forEach((delegation) => {
        updateDelegations(delegation);
        totalDelegation = totalDelegation.add(
          Big(delegation.balance.amount || 0),
        );
      });
      setTotalDelegationAmount(totalDelegation);
    }
  }, [
    data,
    resetDelegationValidatorAddresses,
    resetDelegations,
    setTotalDelegationAmount,
    updateDelegations,
  ]);

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

export default useDelegations;
