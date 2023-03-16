const InsufficientBalance = () => {
  return (
    <button className="inline-block w-full md:py-3 py-2 px-4 text-center font-bold md:text-2xl text-lg md:rounded-2xl rounded-lg text-white bg-red-500 cursor-not-allowed">
      <div className="flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 w-7 h-7"
          viewBox="0 0 20 20"
          fill="currentColor"
          data-config-id="svg-inline8"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Insufficient balance
      </div>
    </button>
  );
};

export default InsufficientBalance;
