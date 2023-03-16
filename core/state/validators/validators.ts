import { Validator } from "../../queries/validators/type";
import { atom, atomFamily, selector } from "recoil";
import { delegatedValidatorAddressesAtom } from "./delegate/delegation";

export const filteredValidatorStatusAtom = atom<string>({
  key: "filteredValidatorStatus",
  default: "",
});

export const validatorFamily = atomFamily<Validator | null, string>({
  key: "validator",
  default: null,
});

export const validatorIdsAtom = atom<string[]>({
  key: "validatorIds",
  default: [],
});

export const myValidatorFamily = atomFamily<Validator | null, string>({
  key: "myValidator",
  default: null,
});

export const myValidatorIdsAtom = atom<string[]>({
  key: "myValidatorIds",
  default: [],
});

export const getMyValidatorsSelector = selector<Validator[]>({
  key: "getMyValidatorsSelector",
  get: ({ get }) => {
    const myDelegatedValidatorAddresses = get(delegatedValidatorAddressesAtom);
    const myValidators: Validator[] = [];
    myDelegatedValidatorAddresses.map((myValidatorAddress) => {
      const validator = get(myValidatorFamily(myValidatorAddress));
      if (validator) myValidators.push(validator);
    });
    return myValidators;
  },
});
