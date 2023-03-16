import Link from "next/link";

export const RecentProposalsView = () => {
  return (
    <div className="relative container mx-auto px-4 py-10 md:py-14 lg:py-16 justify-center">
      <div className="w-full text-center mx-auto lg:w-auto">
        <h2 className="mb-2 text-white font-semibold md:text-3xl text-2xl">
          Recent Proposals
        </h2>
        <p className="md:text-lg text-sm text-white md:mb-4 mb-3">
          Supernova’s recent proposals in this week
        </p>
        <Link href={"/governance/proposals"}>
          <button className="flex items-center justify-center mx-auto text-yellow-500 group group-hover transform transition ease-in-out hover:scale-105">
            <span className="md:text-lg text-sm ">View all proposals</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="md:h-4 md:w-4 h-3 w-3  mt-0.5 transform -rotate-90 md:ml-3 ml-2"
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
          </button>
        </Link>
      </div>
      <div className="flex items-center justify-center flex-wrap lg:px-0 md:px-5 px-0 max-w-5xl mx-auto w-full">
        <div className="hidden md:inline-flex flex-shrink-0 order-first items-center justify-center lg:h-52 h-24 lg:w-24 w-20">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              className="lg:w-9 lg:h-9 h-8 w-8"
            >
              <circle
                cx="30"
                cy="30"
                r="30"
                transform="rotate(-180 30 30)"
                fill="white"
                fillOpacity="0.2"
              ></circle>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M36 21.2568L26.493 30.0051L35.9999 38.7412L33.0509 42L20 30.0074L33.0487 18L36 21.2568Z"
                fill="white"
              ></path>
            </svg>
          </button>
        </div>
        <div className="text-center mx-auto lg:w-auto w-auto">
          <div className="mt-8 mx-auto md:mt-16 lg:max-w-xl max-w-lg">
            <div className="relative text-center md:mt-10 mt-8">
              <button className="inline-block md:w-3 md:h-3 h-2 w-2 md:mr-4 mr-3 bg-white rounded-full"></button>
              <button className="inline-block md:w-3 md:h-3 h-2 w-2 md:mr-4 mr-3 bg-gray-500 rounded-full"></button>
              <button className="inline-block md:w-3 md:h-3 h-2 w-2 md:mr-4 mr-3 bg-gray-500 rounded-full"></button>
              <button className="inline-block md:w-3 md:h-3 h-2 w-2 bg-gray-500 rounded-full"></button>
            </div>
          </div>
        </div>
        <div className="hidden md:inline-flex flex-shrink-0 order-first md:order-last items-center justify-center h-32 lg:h-52 lg:w-24 w-20">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              className="h-8 w-8 lg:h-9 lg:w-9"
            >
              <circle
                cx="30"
                cy="30"
                r="30"
                fill="white"
                fillOpacity="0.2"
                data-path="0.2.1.2.0.0.0"
              ></circle>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24 38.7432L33.507 29.9949L24.0001 21.2588L26.9491 18L40 29.9926L26.9513 42L24 38.7432Z"
                fill="white"
                data-path="0.2.1.2.0.0.1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
