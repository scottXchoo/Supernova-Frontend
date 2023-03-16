import clsx from "clsx";
import Modal from "components/common/Modal";
import useTallyRatio from "core/hooks/proposal/useTallyRatio";
import useUserVote from "core/hooks/proposal/useUserVote";
import { getNovaAddress } from "core/state/coreState";
import { isEditVoteModalOpenAtom, isVoteSuccessModalOpenAtom } from "core/state/proposal/vote/voteModal";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { defaultButtonColor, voteOptionString } from "./types";

const VoteSuccessModal = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useRecoilState(isVoteSuccessModalOpenAtom);
  const setEditVoteIsOpen = useSetRecoilState(isEditVoteModalOpenAtom);
  const novaAddress = useRecoilValue(getNovaAddress);
  const tallyRatio = useTallyRatio(id);
  const { data: userVote } = useUserVote(id, novaAddress);
  if (!userVote || !tallyRatio) return null;
  const userVoteOption = VoteOption[userVote?.option as keyof typeof VoteOption];

  const openEditVoteModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setEditVoteIsOpen(true);
    }, 500);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="relative grid rounded-xl border-yellow-500 z-10 overflow-hidden md:rounded-2xl border-2 bg-blue-500 transition-all w-full">
        <button onClick={() => setIsOpen(false)} className="absolute z-20 right-4 top-3 md:right-6 outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-700 transform lg:w-9 lg:h-9 md:w-8 md:h-8 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="block w-full h-full items-center justify-center">
          <div className="relative px-5 md:px-6 md:py-5 py-4">
            <div className="flex items-start mx-auto md:px-16 px-6 md:mb-8 mb-6">
              <div className="w-full mx-auto">
                <h3 className="text-white text-center font-semibold md:text-3xl text-xl leading-snug md:mt-10 md:leading-snug mt-6">We&apos;ve successfully collected your vote</h3>
              </div>
            </div>
            <div className="md:px-8 px-4 md:mb-8 mb-6">
              <div className={clsx("flex items-center justify-between w-full md:py-3 py-2 md:px-8 px-4 text-black md:text-base text-sm shadow md:mb-3 mb-1.5 md:rounded-md rounded-sm",
                defaultButtonColor[userVoteOption]
              )}>
                <span className="text-left font-semibold">{voteOptionString[userVoteOption]}</span>
              </div>
            </div>
            <button
              onClick={openEditVoteModal}
              className="w-full mx-auto outline-none">
              <p className="text-white leading-tight md:leading-tight px-8 text-center md:px-6 font-semibold md:text-base text-sm mb-3 transform hover:scale-105 ease-in-out transition origin-bottom hover:underline">Edit my vote</p>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default VoteSuccessModal;
