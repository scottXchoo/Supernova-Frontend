import clsx from "clsx";

interface AssetsButtonProps {
  label: string;
  onClick: () => void;
  enabled: boolean;
}
const AssetsButton = ({ label, onClick, enabled }: AssetsButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={!enabled}
      className={clsx(
        "flex items-center bg-blue-500 text-white pr-3 pl-5 rounded-md py-1",
        { "cursor-not-allowed": !enabled },
      )}
    >
      <span className="md:text-sm text-base font-medium lg:text-base">
        {label}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="md:h-4 md:w-4 mt-0.5 transform -rotate-90 md:ml-1.5 ml-1 h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};
export default AssetsButton;
