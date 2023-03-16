import Big from "big.js";
import clsx from "clsx";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { defaultButtonColor, voteOptionString } from "./types";

interface VoteOptionButtonProps {
  userVoteOption?: VoteOption;
  selectedOption: VoteOption | null;
  buttonOption: VoteOption;
  buttonOptionRatio: Big;
  onClick: (option: VoteOption) => void;
};

export const focusButtonStyle =
  "ring-2 ring-offset-1 ring-blue-500";
export const disabledButtonStyle = "bg-gray-500";

export const VoteOptionButton = ({ userVoteOption, selectedOption, buttonOption, buttonOptionRatio, onClick }: VoteOptionButtonProps) => {
  return (
    <button
      onClick={() => onClick(buttonOption)}
      className={clsx(
        "flex items-center justify-between w-full md:py-3 py-2 md:px-8 px-4 rounded-md text-black md:text-base text-sm shadow opacity-100 hover:opacity-90 md:mb-3 mb-1.5",
        buttonOption === userVoteOption ? disabledButtonStyle : defaultButtonColor[buttonOption],
        buttonOption === selectedOption && focusButtonStyle
      )}
    >
      <span className="text-left font-semibold">{voteOptionString[buttonOption]}</span>
      <span className="text-right font-medium">
        {buttonOptionRatio.toFixed(3)}%
      </span>
    </button>
  );
}