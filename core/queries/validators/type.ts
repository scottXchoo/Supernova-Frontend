import Big from "big.js";

export type ValidatorStatus =
  | "BOND_STATUS_UNBONDED"
  | "BOND_STATUS_BONDED"
  | "BOND_STATUS_UNBONDING"
  | "BOND_STATUS_UNSPECIFIED";

export const validatorStatusDisplay: Record<ValidatorStatus, string> = {
  BOND_STATUS_UNSPECIFIED: "Inactive",
  BOND_STATUS_UNBONDING: "Inactive",
  BOND_STATUS_UNBONDED: "Inactive",
  BOND_STATUS_BONDED: "Active",
};

export type ValidatorData = {
  operator_address: string;
  jailed: boolean;
  status: string;
  delegator_shares: string;
  description: {
    moniker: string;
  };
  website: string;
  details: string;
  commission: {
    commission_rates: {
      rate: string;
    };
  };
};

export type Validator = {
  operatorAddress: string;
  jailed: boolean;
  status: string;
  delegatorShares: string;
  moniker?: string;
  website: string;
  details: string;
  commissionRate: string;
  voteShare: Big;
  filteredValidatorStatus: string;
};
