import useNovaBalance from "core/hooks/validators/useNovaBalance";
import { getNovaAddress } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import {
  DEFAULT_NUMBER_STRING,
  parseNovaBalanceToLocaleString,
} from "../delegate/delegateUtils";

const AvailableBalance = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: novaBalance, error: novaBalanceError } =
    useNovaBalance(novaAddress);
  if (novaBalanceError) return null;
  return (
    <div className="w-full bg-black bg-opacity-30 border border-gray-200 rounded-xl grid py-2 px-4">
      <h4 className="lg:text-sm text-xs text-left font-medium border-b border-gray-200 pb-1 mb-2 px-2 text-gray-200">
        Available Balance
      </h4>
      <div className="flex items-center justify-between px-2">
        <div className="grid">
          <div className="group grid justify-start">
            <p className="text-white font-semibold text-left text-xl md:text-2xl overflow-x-auto number-scroll-purple-auto">
              {parseNovaBalanceToLocaleString(novaBalance?.amount || "0")}
            </p>
          </div>
          <p className="text-gray-700 text-xs text-left mr-1 px-1 truncate">
            ≈ ${DEFAULT_NUMBER_STRING}
          </p>
        </div>
        <span className="text-xs font-bold text-white -mt-4 ml-2">NOVA</span>
      </div>
    </div>
  );
};
export default AvailableBalance;
