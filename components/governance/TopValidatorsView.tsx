import { ValidatorCard, ValidatorCardSm } from "./ValidatorCard";

export const TopValidatorsView = () => {
  return (
    <section className="bg-black relative overflow-hidden py-20 bg2 lg:py-36 bg-[url('https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/bg2-v4.png')]">
      <img
        className="absolute left-0 bottom-0 w-full md:h-1/4 h-1/4"
        src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/gradient.png"
        alt=""
      />
      <img
        className="absolute left-0 top-0 lg:h-1/4 w-full md:h-1/3 h-1/4"
        src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/black-gradient.png"
        alt=""
      />
      <div className="relative container mx-auto px-4 md:mb-20 mb-10">
        <div className="relative z-10 flex flex-wrap justify-center items-center">
          <div className="w-full text-center mx-auto lg:w-auto">
            <h2 className="mb-2 text-white font-semibold md:text-3xl text-2xl">
              Top 5 Validators
            </h2>
            <p className="md:text-lg text-sm text-white md:mb-4 mb-3">
              Top 5 validators by voiting weight.
            </p>
            <button className="flex items-center justify-center mx-auto text-yellow-500 group group-hover transform transition ease-in-out hover:scale-105">
              <span className="md:text-lg text-sm ">View all validators</span>
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
          </div>
        </div>
      </div>
      <div className="relative flex flex-wrap lg:justify-center container mx-auto lg:px-0 lg:max-w-5xl px-6">
        <div className="flex-shrink-0 w-full lg:w-1/3 md:w-1/3 lg:px-2 md:px-1 md:py-1 lg:py-2 px-1 py-1.5">
          <ValidatorCard />
        </div>
        <div className="flex-shrink-0 w-full lg:w-1/3 md:w-1/3 lg:px-2 md:px-1 md:py-1 lg:py-2 px-1 py-1.5">
          <ValidatorCard />
        </div>
        <div className="flex-shrink-0 w-full lg:w-1/3 md:w-1/3 lg:px-2 md:px-1 md:py-1 lg:py-2 px-1 py-1.5">
          <ValidatorCard />
        </div>
        <div className="flex-shrink-0 w-full md:w-1/2 lg:px-2 md:px-1 md:py-1 lg:py-2 px-1 py-1.5">
          <ValidatorCardSm />
        </div>
        <div className="flex-shrink-0 w-full md:w-1/2 lg:px-2 md:px-1 md:py-1 lg:py-2 px-1 py-1.5">
          <ValidatorCardSm />
        </div>
      </div>
    </section>
  );
};
