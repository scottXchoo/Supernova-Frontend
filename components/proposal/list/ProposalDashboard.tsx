import { parseNovaBalanceToLocaleString } from "components/validators/delegate/delegateUtils";
import useTotalBondedNova from "core/hooks/proposal/useTotalBondedNova";
import { totalDelegationAtom } from "core/state/validators/delegate/delegation";
import { useRecoilValue } from "recoil";
import React from "react";
import useDelegations from "core/hooks/validators/useDelegations";
import { getNovaAddress } from "core/state/coreState";
import Big from "big.js";
import {
  MINIMUM_POOL_SHARE_RATIO,
  MINIMUM_POOL_SHARE_RATIO_STRING,
} from "core/utils/poolUtil";
import { MAXIMUM_DECIMAL_POINT } from "core/constants/constants";
import { convertBigToPrecisionString } from "core/utils/numberFormatter";

const ProposalDashboard = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: totalBondedNova } = useTotalBondedNova();
  const totalBondedNovaToBig = Big(totalBondedNova || "0");

  useDelegations(novaAddress);
  const totalDelegation = useRecoilValue(totalDelegationAtom);
  const votingPowerPercent = totalBondedNovaToBig.eq(0)
    ? Big(0)
    : totalDelegation.div(totalBondedNovaToBig).mul(100);

  const isMinimalShareRatio =
    Big(votingPowerPercent).lt(MINIMUM_POOL_SHARE_RATIO) &&
    !Big(votingPowerPercent).eq(0);

  const myVotingPowerDisplay = isMinimalShareRatio
    ? MINIMUM_POOL_SHARE_RATIO_STRING
    : convertBigToPrecisionString(votingPowerPercent, MAXIMUM_DECIMAL_POINT);

  return (
    <div className="md:mb-16 mb-4 flex flex-wrap container lg:px-2 xl:px-8 mx-auto xl:max-w-7xl lg:max-w-5xl md:w-full md:px-8">
      <h3 className="w-1/2 md:w-full mx-auto md:px-8 lg:px-2 xl:px-8 font-semibold text-sm md:text-lg lg:text-2xl border-white text-yellow-500 md:mb-4 mb-2">
        Dashboard
      </h3>
      <div className="md:flex w-full md:px-8 lg:px-2 xl:px-8 lg:mb-0 mx-auto mb-10">
        <div className="w-1/2 mx-auto bg-black bg-opacity-30 border border-gray-200 rounded-xl grid mb-3 py-2 px-4 md:mr-16">
          <h4 className="lg:text-sm text-xs text-left font-medium border-b border-gray-200 pb-1 mb-2 px-2 text-gray-200">
            My Votes / Total Votes
          </h4>
          <div className="flex items-center justify-between px-2 my-3 md:h-16 h-8">
            <div className="flex flex-col items-start text-white font-semibold text-left text-base md:text-2xl overflow-x-auto number-scroll-purple-auto">
              {parseNovaBalanceToLocaleString(totalDelegation.toString())}
              <p className="text-sm md:text-base text-gray-500 overflow-x-auto number-scroll-purple-auto">
                / {parseNovaBalanceToLocaleString(totalBondedNova || "0")}
              </p>
            </div>
            <div className="justify-end">
              <span className="text-sm md:text-xl font-semibold text-white -mt-4 ml-2">
                NOVA
              </span>
            </div>
          </div>
        </div>

        <div className="w-1/2 mx-auto bg-black bg-opacity-30 border border-gray-200 rounded-xl grid mb-3 py-2 px-4">
          <h4 className="lg:text-sm text-xs text-left font-medium border-b border-gray-200 pb-1 mb-2 px-2 text-gray-200">
            My Voting Power
          </h4>
          <div className="flex items-center justify-between px-2 my-3 md:h-16 h-8">
            <div className="group grid justify-start">
              <p className="text-white font-semibold text-left text-lg md:text-2xl overflow-x-auto number-scroll-purple-auto">
                {myVotingPowerDisplay}
              </p>
            </div>
            <div className="group justify-end">
              <span className="text-xl font-semibold text-white -mt-4 ml-2">
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDashboard;
