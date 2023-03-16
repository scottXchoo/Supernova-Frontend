import Big from "big.js";
import { REST_BASE_URL } from "core/constants/urlConstants";
import {
  Validator,
  ValidatorData,
  ValidatorStatus,
  validatorStatusDisplay,
} from "./type";

const fetchMyValidators = async (
  address: string,
): Promise<Validator[] | null> => {
  const fetchResult = await fetch(
    `${REST_BASE_URL}/cosmos/staking/v1beta1/delegators/${address}/validators`,
  );

  const data = await fetchResult.json();

  const validators: Validator[] = data.validators.map(
    (validator: ValidatorData) => {
      return {
        operatorAddress: validator.operator_address,
        jailed: validator.jailed,
        status: validatorStatusDisplay[validator.status as ValidatorStatus],
        delegatorShares: validator.delegator_shares,
        moniker: validator.description.moniker,
        website: validator.website,
        details: validator.details,
        commissionRate: validator.commission?.commission_rates?.rate,
        voteShare: Big(0),
      };
    },
  );

  return validators;
};

export default fetchMyValidators;
