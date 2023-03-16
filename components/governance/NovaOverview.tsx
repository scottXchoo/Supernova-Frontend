export const NovaOverview = () => {
  return (
    <div className="container mx-auto px-4 flex items-center lg:px-4 flex-wrap md:px-16 lg:mx-auto justify-between max-w-5xl">
      <div className="w-full lg:w-1/4 md:mb-20 mb-10 md:w-1/3">
        <h3 className="relative text-3xl text-white font-bold w-full text-center md:mb-2">
          NOVA
        </h3>
        <p className="lg:text-sm text-xs font-medium uppercase text-gray-500 w-full text-center">
          Overview
        </p>
      </div>
      <div className="flex w-full flex-wrap mb-20 md:w-1/2 md:px-1 px-5 lg:w-3/4">
        <div className="md:w-1/2 lg:w-1/4 w-1/2 mb-4 md:px-2 flex justify-center px-1">
          <div className="text-center border border-white p-4 rounded-xl grid md:h-36 md:w-36 h-36 w-36 lg:h-48 lg:w-48">
            <div className="relative flex justify-center lg:mb-2 items-end">
              <h3 className="relative text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-yellow-500 to-yellow-500 font-black">
                20M
              </h3>
            </div>
            <p className="lg:text-sm text-xs font-medium text-gray-500">
              Locked
            </p>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/4 w-1/2 mb-4 flex justify-center lg:px-2 px-1">
          <div className="text-center border border-white p-4 rounded-xl grid md:h-36 md:w-36 h-36 w-36 lg:h-48 lg:w-48">
            <div className="relative flex justify-center lg:mb-2 items-end">
              <h3 className="relative text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-yellow-500 to-yellow-500 font-black">
                20M
              </h3>
            </div>
            <p className="text-xs font-medium text-gray-500 leading-normal lg:text-sm">
              Circulating Supply
            </p>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/4 w-1/2 mb-4 md:px-2 flex justify-center px-1">
          <div className="text-center border border-white p-4 rounded-xl grid md:h-36 md:w-36 h-36 w-36 lg:h-48 lg:w-48">
            <div className="relative flex justify-center lg:mb-2 items-end">
              <h3 className="relative text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-yellow-500 to-yellow-500 font-black">
                100M
              </h3>
            </div>
            <p className="lg:text-sm text-xs font-medium text-gray-500">
              Total Supply
            </p>
          </div>
        </div>
        <div className="md:w-1/2 lg:w-1/4 w-1/2 mb-4 md:px-2 flex justify-center px-1">
          <div className="text-center border border-white p-4 rounded-xl grid md:h-36 md:w-36 h-36 w-36 lg:w-48 lg:h-48">
            <div className="relative flex justify-center lg:mb-2 items-end">
              <h3 className="relative text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-yellow-500 to-yellow-500 font-black">
                3K
              </h3>
            </div>
            <p className="lg:text-sm text-xs font-medium text-gray-500">
              Voting Addresses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
