import clsx from "clsx";

interface EditButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const EditButton = ({ onClick, disabled }: EditButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx({
        "opacity-70 cursor-not-allowed": disabled,
      })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
        className="text-white place-self-end col-span-1 md:w-5 md:h-5 w-4 lg:h-6 lg:w-6 h-4 hover:text-blue-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        ></path>
      </svg>
    </button>
  );
};
export default EditButton;
