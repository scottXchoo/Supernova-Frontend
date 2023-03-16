import clsx from "clsx";
import { MouseEventHandler, ReactNode, useState } from "react";

type GroupProps = {
  title: ReactNode;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
const Group = ({ title, onClick, children }: GroupProps) => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const toggleGroup = () => setIsGroupOpen((isOpen) => !isOpen);

  const handleClickGroup = onClick ?? toggleGroup;

  return (
    <>
      <button
        onClick={handleClickGroup}
        className="flex items-center border-t border-yellow-500 py-5 px-10 group w-full"
      >
        <span className="mr-1 text-xl font-medium text-white group-hover:text-yellow-500 group-focus:text-yellow-500">
          {title}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={clsx(
            "h-5 w-5 text-white group-hover:text-yellow-500 group-focus:text-yellow-500 transform transition ease-in-out delay-200",
            { "rotate-180": isGroupOpen },
          )}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      {isGroupOpen && children}
    </>
  );
};

export default Group;
