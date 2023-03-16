import { UnbondingRecord } from "core/queries/validators/fetchUnbondingRecords";
import { validatorFamily } from "core/state/validators/validators";
import { formatTimeDiff } from "core/utils/dateTimeFormat";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import { useRecoilValue } from "recoil";
import { parseNovaBalanceToLocaleString } from "../../delegate/delegateUtils";

const UndelegateTableRow = ({
  validatorAddress,
  balance,
  completionTime,
}: UnbondingRecord) => {
  const validator = useRecoilValue(validatorFamily(validatorAddress));

  return (
    <div className="flex items-center bg-gray-900 rounded-md w-full px-2 h-10 justify-between mb-1">
      <div className="grid grid-cols-3 w-full">
        <div className="flex items-center">
          <span className="leading-tight text-white text-xs">
            {validator?.moniker || makeEllipsisText(validatorAddress)}
          </span>
        </div>
        <p className="text-xs text-white text-center flex items-center justify-center">
          <a className="inline-block truncate mr-1">
            {parseNovaBalanceToLocaleString(balance)}
          </a>
          NOVA
        </p>
        <p className="text-xs text-white text-center">
          {formatTimeDiff(completionTime)} left
        </p>
      </div>
    </div>
  );
};
export default UndelegateTableRow;
