import { FetchResult } from "../proposal/type";
import { useRecoilCallback, useRecoilValue, useResetRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Big from "big.js";
import fetchBondedToken from "core/queries/proposal/fetchBondedToken";
import { Validator } from "core/queries/validators/type";
import fetchMyValidators from "core/queries/validators/fetchMyValidators";
import {
  getMyValidatorsSelector,
  myValidatorFamily,
  myValidatorIdsAtom,
} from "core/state/validators/validators";

const useMyValidators = (address: string): FetchResult<Validator[]> => {
  const myValidators = useRecoilValue(getMyValidatorsSelector);
  const resetMyValidatorsAddresses = useResetRecoilState(myValidatorIdsAtom);
  const {
    data: myValidatorsData,
    error: myValidatorsError,
    isLoading: isLoadingMyValidators,
  } = useQuery({
    queryKey: ["myValidators", address],
    queryFn: () => fetchMyValidators(address),
    enabled: !!address,
  });
  const {
    data: totalBondedData,
    error: totalBondedError,
    isLoading: isLoadingTotalBonded,
  } = useQuery({
    queryKey: ["bondedToken"],
    queryFn: () => fetchBondedToken(),
  });

  const isLoading = isLoadingMyValidators || isLoadingTotalBonded;
  const isError = myValidatorsError || totalBondedError;

  const updateValidator = useRecoilCallback(
    ({ set }) =>
      (validator: Validator) => {
        set(myValidatorIdsAtom, (prev) => [
          ...new Set([...prev, validator.operatorAddress]),
        ]);
        set(myValidatorFamily(validator.operatorAddress), validator);
      },
    [],
  );

  useEffect(() => {
    if (!myValidatorsData || !totalBondedData) {
      return;
    }
    const validators = myValidatorsData.map((validator: Validator) => ({
      ...validator,
      voteShare: Big(validator.delegatorShares).div(Big(totalBondedData)),
    }));
    resetMyValidatorsAddresses();
    validators.forEach((validator) => updateValidator(validator));
  }, [
    myValidatorsData,
    resetMyValidatorsAddresses,
    totalBondedData,
    updateValidator,
  ]);

  if (isLoading) {
    return {
      data: null,
      isLoading: isLoading,
      error: null,
    };
  }

  if (isError) {
    return {
      data: null,
      isLoading: isLoadingMyValidators,
      error: isError as Error,
    };
  }

  return {
    data: myValidators,
    isLoading: isLoading,
    error: null,
  };
};

export default useMyValidators;
