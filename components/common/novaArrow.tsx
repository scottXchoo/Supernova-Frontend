import clsx from "clsx";

type ArrowProps = {
  isRotateTop: boolean;
  style?: string;
  hover?: string;
};

export const NovaArrow = ({ isRotateTop, style, hover }: ArrowProps) => {
  return isRotateTop ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        "md:h-6 md:w-6 h-4 w-4 text-gray-500 mt-0.5 transform transition ease-in-out md:ml-3 ml-2.5 rotate-180",
        `${style ? style : "text-gray-500"}`,
        `${hover ? hover : "hover:text-black"}`,
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        "md:h-6 md:w-6 h-4 w-4 text-gray-500 mt-0.5 transform transition delay-300 ease-in-out md:ml-3 ml-2.5",
        `${hover ? hover : "hover:text-black"}`,
      )}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  );
};
