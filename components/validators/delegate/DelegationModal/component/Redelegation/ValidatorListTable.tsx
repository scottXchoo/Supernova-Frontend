import clsx from "clsx";
import {
  calculateValidatorAPR,
  convertValidatorCommissionRate,
} from "components/validators/delegate/delegateUtils";
import { Apy } from "core/queries/priceFeeder/fetchCoinApy";
import { Validator } from "core/queries/validators/type";
import { DEFAULT_TIMESTAMP_STRING } from "core/utils/dateTimeFormat";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
interface ValidatorListTableType {
  validatorList: Validator[];
  novaAPR: Apy | null | undefined;
  selectedValidator: string | null;
  onClick: (operatorAddress: string) => void;
}
const ValidatorListTable = ({
  validatorList,
  onClick,
  selectedValidator,
  novaAPR,
}: ValidatorListTableType) => {
  return (
    <table className="table-auto w-full text-white">
      <thead>
        <tr className="md:text-sm text-xs text-yellow-500 lg:text-base">
          <th className="font-semibold pl-4 md:pl-8 text-left lg:h-12 md:h-10 h-8">
            Validator
          </th>
          <th className="font-semibold md:px-5 px-3 text-right">Commission</th>
          <th className="font-semibold md:px-4 px-2 text-center">APR</th>
        </tr>
      </thead>
      <tbody>
        {validatorList.map((validator, index) => (
          <tr
            key={validator.operatorAddress}
            onClick={() => onClick(validator.operatorAddress)}
            className={clsx(
              "md:text-sm text-xs hover:bg-purple-500 lg:text-base",
              index % 2 === 0 ? "bg-gray-400 bg-opacity-10" : "bg-transparent",
              selectedValidator === validator.operatorAddress &&
                "bg-purple-500 bg-opacity-100",
            )}
          >
            <td className="font-medium md:h-10 h-8 pl-4 md:pl-8 lg:py-5 md:py-4 py-3">
              <div className="items-center flex">
                <div className="items-center flex flex-shrink-0">
                  <span className="font-semibold leading-tight">
                    {validator.moniker ||
                      makeEllipsisText(validator.operatorAddress)}
                  </span>
                </div>
              </div>
            </td>
            <td className="text-right md:px-5 px-3">
              <p className="font-semibold ">
                {convertValidatorCommissionRate(validator.commissionRate)}%
              </p>
            </td>
            <td className="text-center md:px-4 px-2">
              <p className="font-semibold ">
                {novaAPR
                  ? calculateValidatorAPR(
                      validator.commissionRate,
                      novaAPR.percent,
                    )
                  : DEFAULT_TIMESTAMP_STRING}
                %
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ValidatorListTable;
