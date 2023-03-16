import clsx from "clsx";
import { filteredValidatorStatusAtom } from "core/state/validators/validators";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

type FilteredValidatorsProps = {
  items: {
    label: string;
    status: string;
  }[];
};

export const ValidatorStatusFilter = ({ items }: FilteredValidatorsProps) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const dropDownHandler = () => {
    setOpenDropdown(!openDropdown);
  };
  const setFilteredValidatorStatus = useSetRecoilState(
    filteredValidatorStatusAtom,
  );
  const handleStatusClick = (status: string) => {
    setOpenDropdown(false);
    setFilteredValidatorStatus(status);
  };

  return (
    <div className="relative">
      <button
        onClick={dropDownHandler}
        className="flex items-center font-medium border border-gray-200 hover:border-gray-300 md:justify-center w-full justify-center lg:py-1.5 py-1 rounded-full text-white md:px-5 px-3 lg:text-lg md:text-sm text-xs"
      >
        <span className="text-right">Sort by</span>
        <svg
          className="relative top-px ml-6"
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.97291 0.193232C7.20854 -0.0644107 7.58938 -0.0644107 7.82328 0.193232C8.05804 0.450875 8.05978 0.867141 7.82328 1.12478L4.42529 4.80677C4.19053 5.06441 3.81056 5.06441 3.57406 4.80677L0.176073 1.12478C-0.0586909 0.868102 -0.0586909 0.450875 0.176073 0.193232C0.411706 -0.0644107 0.792544 -0.0644107 1.02644 0.193232L4.00098 3.21284L6.97291 0.193232Z"
            fill="currentColor"
          ></path>
        </svg>
      </button>
      {openDropdown && (
        <div className="absolute right-6 z-10 origin-top-right rounded-xl shadow-lg bg-black border-white border md:p-1 p-0.5 md:mt-2 mt-1">
          <div className="group py-1 px-2 text-right md:w-40 w-32">
            {items.map((item, index) => (
              <div
                key={`${item.label}/${item.status}`}
                onClick={() => {
                  handleStatusClick(item.status);
                }}
                className={clsx(
                  "cursor-pointer block text-white hover:text-yellow-500 md:text-sm text-xs md:px-4 px-2 md:py-2 py-1.5",
                  index === items.length - 1
                    ? "border-none"
                    : "border-white border-dashed border-b",
                )}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
