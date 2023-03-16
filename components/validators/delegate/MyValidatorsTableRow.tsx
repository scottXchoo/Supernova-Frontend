import clsx from "clsx";
import { useWallet } from "core/hooks/useWallet";
import { Validator } from "core/queries/validators/type";
import { delegationFamily } from "core/state/validators/delegate/delegation";
import { rewardFamily } from "core/state/validators/rewards";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import { useRecoilValue } from "recoil";
import { parseNovaBalanceToLocaleString } from "./delegateUtils";
import EditButton from "./EditButton";

interface MyValidatorsTableRowProps {
  index: number;
  validator: Validator;
  onClick: (address: string) => void;
}

const MyValidatorsTableRow = ({
  index,
  validator,
  onClick,
}: MyValidatorsTableRowProps) => {
  const { enabled } = useWallet();
  const delegation = useRecoilValue(
    delegationFamily(validator.operatorAddress),
  );
  const reward = useRecoilValue(rewardFamily(validator.operatorAddress));
  if (!delegation) return null;
  return (
    <tr
      key={validator.operatorAddress}
      className={clsx(
        "bg-gray-400 md:text-sm text-xs lg:text-base",
        index % 2 === 0 ? "bg-opacity-10" : "bg-opacity-0",
      )}
    >
      <td className="font-medium md:h-12 lg:pl-8 py-2 lg:py-4 lg:pr-5 h-12 md:pl-4 relative pr-10 md:pr-5 lg:h-20 md:py-3">
        <div className="items-center flex">
          <div className="relative lg:w-12 lg:h-12 w-9 h-9 lg:mr-6 md:mr-3 lg:text-xl md:text-base text-sm">
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">
              {index + 1}
            </span>
          </div>
          <div className="items-center flex flex-shrink-0">
            <span className="font-semibold leading-tight">
              {validator.moniker || makeEllipsisText(validator.operatorAddress)}
            </span>
          </div>
        </div>
      </td>
      <td className="md:h-12 text-right py-2 lg:py-4 h-12 lg:h-20 md:px-8 px-3">
        <p className="font-medium text-right">
          {parseNovaBalanceToLocaleString(delegation.amount)} NOVA
        </p>
      </td>
      <td className="md:h-12 py-2 lg:py-3 h-12 md:px-8 px-5 text-right lg:h-20">
        <p className="font-medium text-right">
          {parseNovaBalanceToLocaleString(reward?.amount || "0")} NOVA
        </p>
      </td>
      <td className="md:h-12 py-2 h-12 lg:py-4 text-center px-5 lg:h-20 md:px-10">
        <div className="flex items-center justify-end">
          <EditButton
            onClick={() => {
              onClick(validator.operatorAddress);
            }}
            disabled={!enabled}
          />
        </div>
      </td>
    </tr>
  );
};
export default MyValidatorsTableRow;
