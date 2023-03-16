import useTallyRatio from "core/hooks/proposal/useTallyRatio";
import { Tally } from "core/queries/proposal/types";
interface ProposalCardTallyProps {
  id: string;
  tally: Tally | null;
}
const ProposalCardTally = ({ id, tally }: ProposalCardTallyProps) => {
  const tallyRatio = useTallyRatio(id, tally);
  if (!tallyRatio) return null;
  const {
    ratio: { yesRatio, noRatio, noWithVetoRatio, abstainRatio },
    width: { yesWidth, noWidth, noWithVetoWidth, abstaiWidth },
  } = tallyRatio.tallyRatio;

  return (
    <>
      <div className="md:mt-6 mt-3 md:mb-4 mb-3">
        <div className="rounded-full z-0 relative flex overflow-hidden bg-gray-200">
          <div
            className="left-0 top-0 md:h-4 h-3 rounded-full z-30 bg-yellow-500 w-[45%]"
            style={{ width: `${yesWidth}%` }}
          ></div>
          <div
            className="absolute md:h-4 h-3 top-0 rounded-full z-20 bg-purple-500  w-[65%]"
            style={{ width: `${noWidth}%` }}
          ></div>
          <div
            className="absolute md:h-4 h-3 left-0 top-0  rounded-full z-10 bg-red-500  w-[75%]"
            style={{ width: `${noWithVetoWidth}%` }}
          ></div>
          <div
            className="absolute md:h-4 h-3 left-0 top-0  rounded-full z-0 bg-purple-300  w-[83%]"
            style={{ width: `${abstaiWidth}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="grid md:grid-cols-2 grid-cols-1 w-3/4 lg:w-2/3 md:w-4/5 md:grid-cols-5">
          <div className="flex items-center col-span-2">
            <p className="inline-block rounded-full bg-yellow-500 text-xs text-black md:mr-2 mr-1 mb-1 tracking-tight font-semibold w-9 text-center lg:text-sm md:w-10 lg:w-14">
              Yes
            </p>
            <span className="text-gray-700 text-right md:text-sm text-xs truncate">
              {yesRatio.toFixed(3)}%
            </span>
          </div>
          <div className="flex items-center col-span-3">
            <p className="inline-block rounded-full bg-red-500 text-xs text-black md:mr-2 mr-1 mb-1 tracking-tight font-semibold text-center lg:text-sm lg:w-24 md:w-20 w-20">
              No+Veto
            </p>
            <span className="text-gray-700 text-right md:text-sm text-xs truncate">
              {noWithVetoRatio.toFixed(3)}%
            </span>
          </div>
          <div className="flex items-center col-span-2">
            <p className="inline-block rounded-full bg-purple-500 text-xs text-black md:mr-2 mr-1 mb-1 tracking-tight font-semibold w-9 text-center lg:text-sm md:w-10 lg:w-14">
              No
            </p>
            <span className="text-gray-700 text-right md:text-sm text-xs truncate">
              {noRatio.toFixed(3)}%
            </span>
          </div>
          <div className="flex items-center col-span-3">
            <p className="inline-block rounded-full bg-purple-300 text-xs text-black md:mr-2 mr-1 mb-1 tracking-tight font-semibold text-center lg:text-sm lg:w-24 md:w-20 w-20">
              Abstain
            </p>
            <span className="text-gray-700 text-right md:text-sm text-xs truncate">
              {abstainRatio.toFixed(3)}%
            </span>
          </div>
        </div>
        {/* <p className="w-1/4 text-right text-sm text-gray-700 font-bold md:px-4 px-2 lg:w-1/3 lg:text-base md:w-1/5">
          {totalTally.toNumber().toLocaleString()}
        </p> */}
      </div>
    </>
  );
};
export default ProposalCardTally;
