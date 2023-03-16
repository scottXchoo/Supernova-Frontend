import useProposal from "core/hooks/proposal/useProposal";
import useTallyRatio from "core/hooks/proposal/useTallyRatio";
import { parseNovaBalanceToLocaleString } from "components/validators/delegate/delegateUtils";

const VotingDetail = ({ id }: { id: string }) => {
  const { data: proposal, error: proposalError } = useProposal(id);
  const tallyRatio = useTallyRatio(id, proposal?.tally);
  if (!proposal || proposalError || !tallyRatio) return null;
  const {
    tally: { yes, no, abstain, noWithVeto },
    ratio: { yesRatio, noRatio, noWithVetoRatio, abstainRatio },
    width: { yesWidth, noWidth, noWithVetoWidth, abstaiWidth },
  } = tallyRatio.tallyRatio;
  const totalBondedToken = tallyRatio.totalBondedToken;
  return (
    <div className="flex items-start justify-between w-full border-b border-gray-700 border-dashed flex-wrap py-6 lg:py-14 md:py-10">
      <div className="lg:w-1/3 w-full">
        <h2 className="text-black md:text-lg text-sm text-left font-semibold lg:text-xl lg:mb-0 md:mb-6 mb-4">
          Voting details
        </h2>
      </div>
      <div className="lg:w-2/3 w-full">
        <div className="block border border-gray-700 rounded-md px-6 flex flex-wrap mb-6 md:py-8 py-6">
          <div className="rounded-full z-0 relative flex overflow-hidden w-full mb-1 md:mb-2 bg-gray-200">
            <div
              className="left-0 top-0 md:h-4 h-3 rounded-full z-30 bg-yellow-500"
              style={{ width: `${yesWidth}%` }}
            />
            <div
              className="absolute md:h-4 h-3 top-0 rounded-full z-20 bg-purple-500"
              style={{ width: `${noWidth}%` }}
            />
            <div
              className="absolute md:h-4 h-3 left-0 top-0  rounded-full z-10 bg-red-500"
              style={{ width: `${noWithVetoWidth}%` }}
            />
            <div
              className="absolute md:h-4 h-3 left-0 top-0  rounded-full z-0 bg-purple-300"
              style={{ width: `${abstaiWidth}%` }}
            />
          </div>
          <p className="md:text-sm text-xs font-semibold text-left w-1/2 text-gray-900">
            Total
          </p>
          <p className="md:text-sm text-xs font-medium text-right w-1/2 text-gray-900">
            {parseNovaBalanceToLocaleString(totalBondedToken.toString())}
          </p>
        </div>
        <div className="flex flex-wrap w-full">
          <div className="w-full grid md:grid-cols-4 grid-cols-2 md:space-x-2">
            <div className="rounded-md bg-yellow-500 divide-y divide-black px-4 py-3 md:mr-0 md:mb-0 mb-2 mr-1">
              <div className="flex w-full justify-between ">
                <p className="md:text-sm text-xs text-black md:mb-2 mb-1 font-semibold text-left">
                  Yes
                </p>
                <span className="text-black md:text-sm text-xs text-right font-medium">
                  {yesRatio.toNumber().toLocaleString()}%
                </span>
              </div>
              <p className="text-xs text-black font-medium text-right w-full">
                {parseNovaBalanceToLocaleString(yes.toString())}
              </p>
            </div>
            <div className="rounded-md bg-purple-500 divide-y divide-black px-4 py-3 mb-2 md:mb-0 md:ml-0 ml-1">
              <div className="flex w-full justify-between ">
                <p className="md:text-sm text-xs text-black md:mb-2 mb-1 font-semibold text-left">
                  No
                </p>
                <span className="text-black md:text-sm text-xs text-right font-medium">
                  {noRatio.toNumber().toLocaleString()}%
                </span>
              </div>
              <p className="text-xs text-black font-medium text-right w-full">
                {parseNovaBalanceToLocaleString(no.toString())}
              </p>
            </div>
            <div className="rounded-md bg-red-500 divide-y divide-black px-4 py-3 md:mr-0 mr-1">
              <div className="flex w-full justify-between">
                <p className="md:text-sm text-xs text-black md:mb-2 mb-1 font-semibold text-left">
                  No+Veto
                </p>
                <span className="text-black md:text-sm text-xs text-right font-medium">
                  {noWithVetoRatio.toNumber().toLocaleString()}%
                </span>
              </div>
              <p className="text-xs text-black font-medium text-right w-full">
                {parseNovaBalanceToLocaleString(noWithVeto.toString())}
              </p>
            </div>
            <div className="rounded-md bg-purple-300 divide-y divide-black px-4 py-3 md:ml-0 ml-1">
              <div className="flex w-full justify-between ">
                <p className="md:text-sm text-xs text-black md:mb-2 mb-1 font-semibold text-left">
                  Abstain
                </p>
                <span className="text-black md:text-sm text-xs text-right font-medium">
                  {abstainRatio.toNumber().toLocaleString()}%
                </span>
              </div>
              <p className="text-xs text-black font-medium text-right w-full">
                {parseNovaBalanceToLocaleString(abstain.toString())}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingDetail;
