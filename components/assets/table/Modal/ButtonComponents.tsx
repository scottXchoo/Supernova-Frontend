import clsx from "clsx";

interface ActiveButtonProps {
  content: string;
  onClick: () => void;
}
export const ActiveButton = ({ content, onClick }: ActiveButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-white hover:bg-opacity-90 hover:text-yellow-500 font-semibold transform duration-200 shadow-sm text-lg bg-black"
    >
      {content}
    </button>
  );
};

interface LoadingButtonProps {
  content: string;
}
export const LoadingButton = ({ content }: LoadingButtonProps) => {
  return (
    <button className="flex items-center justify-center w-full md:py-3 py-2 px-4 md:rounded-xl rounded-lg shadow-sm relative bg-gray-400 cursor-not-allowed">
      <span
        className="text-center md:text-2xl text-gray-700  font-semibold  text-lg"
        data-config-id="text21"
      >
        {content}
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
};

interface InactiveButtonProps {
  content: string;
}
export const InactiveButton = ({ content }: InactiveButtonProps) => {
  return (
    <button className="inline-block w-full md:py-3 py-2 px-4 text-center md:text-2xl md:rounded-xl rounded-lg bg-gray-500 opacity-70 cursor-not-allowed font-semibold shadow-sm text-lg">
      {content}
    </button>
  );
};

interface PurpleHalfMaxButtonProps {
  content: string;
  isActive: boolean;
  className?: string;
  onClick: () => void;
}
export const PurpleHalfMaxButton = ({
  content,
  isActive,
  onClick,
  className,
}: PurpleHalfMaxButtonProps) => {
  return (
    <button
      className={clsx(
        "cursor-pointer block bg-white border hover:bg-purple-300 border-purple-300 rounded md:px-2.5 md:text-base text-xs font-bold text-black px-2",
        {
          "bg-purple-300": isActive,
        },
        className,
      )}
      onClick={onClick}
    >
      {content}
    </button>
  );
};
