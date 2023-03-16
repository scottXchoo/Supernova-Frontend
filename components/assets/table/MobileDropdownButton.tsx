import clsx from "clsx";

interface MobileDropdownButtonProps {
  onClick: () => void;
  isOpen: boolean;
}
const MobileDropdownButton = ({
  onClick,
  isOpen,
}: MobileDropdownButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center bg-blue-500 text-white py-1 p-1 rounded-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("md:h-4 md:w-4 w-4 h-4", { "rotate-180": isOpen })}
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
export default MobileDropdownButton;
