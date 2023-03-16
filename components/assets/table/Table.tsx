import { assetDisplayDenomList } from "core/state/assets/assets";
import { useRecoilValue } from "recoil";
import DepositModal from "./Modal/DepositModal";
import WithdrawModal from "./Modal/WithdrawModal";
import TableRow from "./TableRow";

const Table = () => {
  const displayDenomList = useRecoilValue(assetDisplayDenomList);

  return (
    <div className="w-full mb-2">
      <div className="ml-auto overflow-x-auto">
        <div className="md:inline-block hidden min-w-full rounded-lg bg-white border border-gray-300 overflow-hidden">
          <table className="table-auto w-full text-white">
            <thead className="bg-black rounded-lg">
              <tr className="md:text-sm text-xs lg:text-base">
                <th className="font-semibold text-yellow-500 text-left md:h-14 h-7 pl-16 md:pl-20 w-1/3">
                  Asset/Chain
                </th>
                <th className="font-semibold text-yellow-500 text-right md:h-14 h-7 w-1/3 lg:pr-10 pr-8">
                  Balance
                </th>
                <th className="font-semibold text-yellow-500 md:h-14 h-7 lg:text-right text-center lg:pr-20 lg:px-0 px-14">
                  Deposit
                </th>
                <th className="font-semibold text-yellow-500 md:h-14 h-7 lg:pl-16 lg:text-left text-center lg:pr-0 pr-6">
                  Withdraw
                </th>
              </tr>
            </thead>
            <tbody>
              {displayDenomList?.map((displayDenom, index) => (
                <TableRow
                  key={displayDenom}
                  index={index}
                  displayDenom={displayDenom}
                />
              ))}
            </tbody>
            <WithdrawModal />
            <DepositModal />
          </table>
        </div>
        <div className="md:hidden inline-block min-w-full rounded-lg bg-white border border-gray-300 overflow-hidden">
          <table className="table-auto w-full text-white">
            <thead className="bg-black rounded-lg">
              <tr className="md:text-sm lg:text-base text-xs">
                <th className="font-semibold text-yellow-500 text-left md:h-14 pl-8 h-8 w-3/7">
                  Asset/Chain
                </th>
                <th className="font-semibold text-yellow-500 text-right md:h-14 h-7 w-3/7">
                  <div className="flex items-center justify-end">
                    <span className="">Balance</span>
                  </div>
                </th>
                <th className="font-semibold text-yellow-500 md:h-14 h-7 lg:text-right text-center"></th>
              </tr>
            </thead>
            <tbody>
              {displayDenomList?.map((displayDenom, index) => (
                <TableRow
                  key={displayDenom}
                  index={index}
                  displayDenom={displayDenom}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Table;
