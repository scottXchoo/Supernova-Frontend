import useIsUserDelegate from "core/hooks/proposal/useIsUserDelegate";
import useProposalDeposits from "core/hooks/proposal/useProposalDeposits";
import useProposal from "core/hooks/proposal/useProposal";
import useUserVote from "core/hooks/proposal/useUserVote";
import { getNovaAddress } from "core/state/coreState";
import {
  isEditVoteModalOpenAtom,
  isVoteModalOpenAtom,
} from "core/state/proposal/vote/voteModal";
import {
  DEFAULT_TIMESTAMP_STRING,
  localizeTime,
} from "core/utils/dateTimeFormat";
import { useRecoilValue, useSetRecoilState } from "recoil";
import EditVoteModal from "./vote/EditVoteModal";
import VoteModal from "./vote/VoteModal";
import { makeEllipsisText } from "core/utils/makeEllipsisText";
import VoteSuccessModal from "./vote/VoteSuccessModal";

const Overview = ({ id }: { id: string }) => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: proposal, error: proposalError } = useProposal(id);
  const { data: depositsData } = useProposalDeposits(id);
  const { data: userVote } = useUserVote(id, novaAddress);
  const setVoteModalOpen = useSetRecoilState(isVoteModalOpenAtom);
  const setEditVoteModalOpen = useSetRecoilState(isEditVoteModalOpenAtom);
  const { data: isUserDelegate } = useIsUserDelegate(novaAddress);

  if (!proposal || proposalError) return null;
  const { overview: overviewData } = proposal;
  const isVotingPeriod =
    overviewData.status === "PROPOSAL_STATUS_VOTING_PERIOD";
  const isDepositPeriod =
    overviewData.status === "PROPOSAL_STATUS_DEPOSIT_PERIOD";
  const isUserCanVote = isVotingPeriod && isUserDelegate;

  return (
    <>
      <div className="flex items-start justify-between w-full flex-wrap">
        <div className="lg:w-1/2 w-full lg:mb-0 mb-4 md:mb-2">
          <h2 className="text-xl text-left text-black tracking-tight leading-tight font-semibold leading-none md:mb-4 mb-2 lg:text-3xl md:text-2xl">
            {overviewData.title}
          </h2>
          <a className="rounded-full -mx-1 bg-blue-500 text-xs tracking-tight text-white md:mb-4 mb-2 md:py-1 py-0.5 font-semibold px-2 inline-block justify-self-start md:px-4 lg:text-base md:text-sm">
            {overviewData.type}
          </a>
        </div>
        {depositsData && (
          <div className="w-full flex lg:w-1/2 justify-start md:justify-end">
            <div className="block border border-black rounded-md p-2 lg:p-4 md:p-3 items-center md:px-4">
              <div className="grid justify-items-start items-center">
                <h3 className="text-black text-xs text-left font-semibold lg:text-sm">
                  Proposer
                </h3>
                <p
                  className="text-gray-700 font-medium text-left text-xs lg:text-sm truncate"
                  data-config-id="text32"
                >
                  {makeEllipsisText(depositsData.depositor)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between w-full border-b border-gray-700 border-dashed flex-wrap items-center py-6 lg:py-12 md:py-10">
        <div className="flex divide-black md:w-1/2 w-full md:mb-0 mb-4 divide-x">
          <div className="pr-2 md:pr-4">
            <h3 className="text-black text-sm text-left font-semibold lg:text-base">
              Voting starts
            </h3>
            <p className="text-gray-700 font-medium text-left text-xs lg:text-sm">
              {isDepositPeriod
                ? DEFAULT_TIMESTAMP_STRING
                : localizeTime(overviewData.votingStartTime)}
            </p>
          </div>
          <div className="pl-2 md:pl-4">
            <h3 className="text-black text-left font-semibold text-sm lg:text-base">
              Voting ends
            </h3>
            <p className="text-gray-700 font-medium text-left text-xs lg:text-sm">
              {isDepositPeriod
                ? DEFAULT_TIMESTAMP_STRING
                : localizeTime(overviewData.votingEndTime)}
            </p>
          </div>
        </div>
        {isUserCanVote && (
          <button
            onClick={() =>
              userVote ? setEditVoteModalOpen(true) : setVoteModalOpen(true)
            }
            className="block bg-blue-500 rounded-md items-start text-white font-semibold lg:text-xl text-sm px-12 p-3 lg:px-16 md:px-14 md:p-4"
          >
            {userVote ? "Edit Vote" : "Vote"}
          </button>
        )}
        <VoteModal id={id} />
        <EditVoteModal id={id} />
        <VoteSuccessModal id={id} />
      </div>
    </>
  );
};

export default Overview;
