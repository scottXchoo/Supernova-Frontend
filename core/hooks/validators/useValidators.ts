import {
  validatorIdsAtom,
  validatorFamily,
} from "../../state/validators/validators";
import { useRecoilCallback } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Big from "big.js";
import fetchBondedToken from "core/queries/proposal/fetchBondedToken";
import { Validator } from "core/queries/validators/type";
import fetchValidators from "core/queries/validators/fetchValidators";

const useValidators = (validator: Validator[] | null = null) => {
  const {
    data: validatorData,
    error: validatorError,
    isLoading: isLoadingValidator,
  } = useQuery({
    queryKey: ["validators"],
    queryFn: () => fetchValidators(),
    initialData: validator,
  });

  const {
    data: totalBondedData,
    error: totalBondedError,
    isLoading: isLoadingTotalBonded,
  } = useQuery({
    queryKey: ["bondedToken"],
    queryFn: () => fetchBondedToken(),
  });

  const [validators, setValidators] = useState<Validator[]>([]);

  const isLoading = isLoadingValidator || isLoadingTotalBonded;
  const isError = validatorError || totalBondedError;

  const updateValidator = useRecoilCallback(
    ({ set }) =>
      (validator: Validator) => {
        set(validatorIdsAtom, (prev) => [...prev, validator.operatorAddress]);
        set(validatorFamily(validator.operatorAddress), validator);
      },
    [],
  );

  useEffect(() => {
    if (!validatorData || !totalBondedData) {
      return;
    }
    const copiedValidators = [...validatorData];
    copiedValidators?.sort((a: Validator, b: Validator) => {
      return Number(b.delegatorShares) - Number(a.delegatorShares);
    });
    const validators = copiedValidators.map((validator: Validator) => ({
      ...validator,
      voteShare: Big(validator.delegatorShares).div(Big(totalBondedData)),
    }));
    setValidators(validators);
    validators.forEach((validator) => updateValidator(validator));
  }, [totalBondedData, validatorData, updateValidator]);

  return {
    data: validators || [],
    isLoading: isLoading,
    error: isError as Error,
  };
};

export default useValidators;
