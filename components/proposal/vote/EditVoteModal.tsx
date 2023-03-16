import useTallyRatio from "core/hooks/proposal/useTallyRatio";
import { formatTimeDiff } from "core/utils/dateTimeFormat";
import { useState } from "react";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { useRecoilState, useRecoilValue } from "recoil";
import { isEditVoteModalOpenAtom } from "core/state/proposal/vote/voteModal";
import useUserVote from "core/hooks/proposal/useUserVote";
import { getNovaAddress } from "core/state/coreState";
import useProposal from "core/hooks/proposal/useProposal";
import useVoteMutation from "core/hooks/proposal/useVoteMutation";
import { VoteOptionButton } from "./VoteOptionButton";
import Modal from "components/common/Modal";

const EditVoteModal = ({ id }: { id: string }) => {
  const voteMutation = useVoteMutation(id);
  const novaAddress = useRecoilValue(getNovaAddress);
  const [isOpen, setIsOpen] = useRecoilState(isEditVoteModalOpenAtom);
  const [voteOption, setVoteOption] = useState<VoteOption | null>(null);
  const { data: proposal, error: proposalError } = useProposal(id);
  const tallyRatio = useTallyRatio(id);
  const { data: userVote } = useUserVote(id, novaAddress);
  const userVoteOption = VoteOption[userVote?.option as keyof typeof VoteOption];
  if (!proposal || proposalError || !tallyRatio) return null;
  const {
    ratio: { yesRatio, noRatio, noWithVetoRatio, abstainRatio },
  } = tallyRatio.tallyRatio;

  const handleOnClose = () => {
    setIsOpen(false);
    setVoteOption(null);
  }

  const voteOptionButtonClicked = (option: VoteOption) => {
    const isUserVoteOption = option === userVoteOption;
    const isVoteOption = option === voteOption;
    if (!isUserVoteOption) {
      isVoteOption ? setVoteOption(null) : setVoteOption(option);
    }
  };

  const onVoteButtonClicked = async () => {
    if (voteOption) {
      voteMutation.mutate(voteOption);
      handleOnClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <div className="grid rounded-xl z-10 overflow-hidden md:rounded-2xl border-2 border-purple-300 bg-white transition-all w-full">
        <div className="items-center justify-between w-full block pt-1 relative md:pt-3 md:pb-3 border-b pb-1.5 bg-blue-500 border-purple-300 px-6 md:px-8">
          <div className="flex items-center text-white">
            <h3 className="text-center md:text-2xl text-lg font-bold">
              Edit Vote
            </h3>
          </div>
          <button
            onClick={handleOnClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="lg:w-9 lg:h-9 md:w-8 md:h-8 md:right-6 w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="block w-full h-full items-center justify-center">
          <div className="relative md:px-8 py-6 px-5 md:py-7">
            <h3 className="w-full text-black text-left font-semibold md:text-3xl leading-snug text-xl md:mb-3 tracking-tight md:px-4 px-2 mb-1.5">
              {proposal.overview.title}
            </h3>
            <p className="w-full text-black md:text-sm text-xs leading-tight md:leading-tight px-8 font-semibold text-right md:mb-6 mb-4 md:px-6">
              {formatTimeDiff(proposal.overview.votingEndTime)}
            </p>
            <div className="md:px-8 px-4 md:mb-6 mb-4">
              <VoteOptionButton
                onClick={voteOptionButtonClicked}
                userVoteOption={userVoteOption}
                selectedOption={voteOption}
                buttonOption={VoteOption.VOTE_OPTION_YES}
                buttonOptionRatio={yesRatio}
              />
              <VoteOptionButton
                onClick={voteOptionButtonClicked}
                userVoteOption={userVoteOption}
                selectedOption={voteOption}
                buttonOption={VoteOption.VOTE_OPTION_NO}
                buttonOptionRatio={noRatio}
              />
              <VoteOptionButton
                onClick={voteOptionButtonClicked}
                userVoteOption={userVoteOption}
                selectedOption={voteOption}
                buttonOption={VoteOption.VOTE_OPTION_NO_WITH_VETO}
                buttonOptionRatio={noWithVetoRatio}
              />
              <VoteOptionButton
                onClick={voteOptionButtonClicked}
                userVoteOption={userVoteOption}
                selectedOption={voteOption}
                buttonOption={VoteOption.VOTE_OPTION_ABSTAIN}
                buttonOptionRatio={abstainRatio}
              />
            </div>
            {voteOption ? (
              <button onClick={onVoteButtonClicked}
                className="inline-block w-full md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-2xl rounded-lg text-white font-semibold shadow-sm bg-blue-500 hover:bg-blue-400">
                Edit Vote
              </button>
            ) : (
              <button className="inline-block w-full md:py-4 py-2 px-4 text-center md:text-2xl text-lg md:rounded-2xl rounded-lg text-gray-200 font-semibold shadow-sm bg-gray-700">
                Edit Vote
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default EditVoteModal;
