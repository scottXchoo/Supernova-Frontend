import { Menu as DropDown, Transition } from "@headlessui/react";
import { Fragment, MouseEventHandler, ReactNode } from "react";

type GroupProps = {
  title: ReactNode;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
const Group = ({ title, onClick, children }: GroupProps) => {
  return (
    <DropDown as="div" className="mr-8 group flex items-end relative">
      <div>
        <DropDown.Button
          className="text-white font-medium group-hover:text-yellow-500 flex flex-row items-center"
          onClick={onClick}
        >
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </DropDown.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <DropDown.Items className="absolute -mx-1 top-8 z-50 mt-2 origin-top-right rounded-md bg-white border-2 border-yellow-500 py-1 px-1 shadow-md">
          {children}
        </DropDown.Items>
      </Transition>
    </DropDown>
  );
};

export default Group;
