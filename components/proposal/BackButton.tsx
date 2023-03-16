import Link from "next/link";

const BackButton = () => {
  return (
    <Link href={"/governance/proposals"}>
      <button className="flex items-center justify-center text-yellow-500 group group-hover transform transition ease-in-out hover:scale-105 md:mb-4 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="md:h-8 md:w-8 mt-0.5 transform rotate-90 md:mr-3 mr-1 h-5 w-5"
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
        <h2 className="font-semibold md:text-2xl text-lg">Proposals</h2>
      </button>
    </Link>
  );
};

export default BackButton;
