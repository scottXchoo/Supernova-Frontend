import useCoinApy from "core/hooks/priceFeeder/useCoinApy";
import { validatorFamily } from "core/state/validators/validators";
import { APY_ZONE_NAME_NOVA } from "core/constants/constants";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import { useRecoilValue } from "recoil";
import {
  DEFAULT_NUMBER_STRING,
  calculateValidatorAPR,
  convertValidatorCommissionRate,
} from "../../delegateUtils";

export interface ValidatorInfoProps {
  operatorAddress: string;
}
const ValidatorInfo = ({ operatorAddress }: ValidatorInfoProps) => {
  const validator = useRecoilValue(validatorFamily(operatorAddress));
  const { data: novaAPR } = useCoinApy(APY_ZONE_NAME_NOVA);
  if (!validator) return null;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 md:mb-5">
        <h3 className="text-white text-left font-semibold text-lg md:text-xl">
          {validator.moniker || makeEllipsisText(validator.operatorAddress)}
        </h3>
        {validator.website && (
          <button
            onClick={() => window.open(validator.website, "_blank")}
            className="rounded-full text-white bg-blue-500 flex items-center md:py-0.5 md:px-4 px-3 py-0.5"
          >
            <span className="text-xs font-semibold md:text-base mr-1">
              Visit site
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
              className="md:w-5 md:h-5 w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </button>
        )}
      </div>
      <p className="text-white md:text-sm text-xs leading-tight md:leading-tight md:mb-5 mb-4">
        {validator.details}
      </p>
      <div className="flex items-center justify-start w-full md:mb-2 mb-1">
        <p className="text-yellow-500 font-semibold text-xs leading-tight md:leading-tight mr-2 md:text-base">
          Commission
        </p>
        <p className="text-white font-semibold text-xs leading-tight md:leading-tight md:text-base">
          {convertValidatorCommissionRate(validator.commissionRate)}%
        </p>
      </div>
      <div className="flex items-center justify-start w-full">
        <p className="text-yellow-500 font-semibold text-xs leading-tight md:leading-tight mr-2 md:text-base">
          APR
        </p>
        <p className="text-white font-semibold text-xs leading-tight md:leading-tight md:text-base">
          {novaAPR
            ? calculateValidatorAPR(validator.commissionRate, novaAPR.percent)
            : DEFAULT_NUMBER_STRING}
          %
        </p>
      </div>
    </div>
  );
};
export default ValidatorInfo;
