import clsx from "clsx";
export interface BackButtonProps {
  className?: string;
  onClick: () => void;
}
export const BackButton = ({ className, onClick }: BackButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
        className="lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
          className=""
        />
      </svg>
    </button>
  );
};

export interface CloseButtonProps {
  className?: string;
  onClick: () => void;
}
export const CloseButton = ({ className, onClick }: CloseButtonProps) => {
  return (
    <button
      className={clsx("absolute md:top-4 md:right-4 top-2 right-2", className)}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="text-white md:w-7 md:h-7 w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};
