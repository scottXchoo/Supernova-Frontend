interface RewardsClaimButtonProps {
  isLoading: boolean;
  isActive: boolean;
  onClick: () => void;
}
const RewardsClaimButton = ({
  isLoading,
  isActive,
  onClick,
}: RewardsClaimButtonProps) => {
  if (isLoading) {
    return (
      <button className="cursor-not-allowed flex items-center justify-center w-full md:py-3 py-2 px-4 md:rounded-xl rounded-lg shadow-sm relative bg-gray-400 ">
        <span
          className="text-center md:text-lg text-sm text-gray-700  font-semibold "
          data-config-id="text83"
        >
          Claim
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          className="animate-spin ml-2 md:w-6 md:h-6 h-4 w-4"
        >
          <circle
            cx="15"
            cy="15"
            r="13.25"
            stroke="#D9D9D9"
            strokeWidth="3.5"
          ></circle>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30V26.5C8.64873 26.5 3.5 21.3513 3.5 15C3.5 8.64873 8.64873 3.5 15 3.5V0Z"
            fill="#AAAAFF"
          />
        </svg>
      </button>
    );
  }

  if (isActive) {
    return (
      <button
        onClick={onClick}
        className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-lg text-sm md:rounded-xl rounded-lg text-white bg-blue-500 hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm"
      >
        Claim
      </button>
    );
  } else {
    return (
      <button className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-lg text-sm md:rounded-xl rounded-lg bg-blue-500 text-white opacity-70 cursor-not-allowed font-semibold shadow-sm">
        Claim
      </button>
    );
  }
};
export default RewardsClaimButton;
