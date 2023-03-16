export const EmptyDataUI = () => {
  return (
    <div className="relative flex flex-wrap container mx-auto xl:max-w-7xl lg:max-w-5xl md:w-full lg:px-0 md:px-4 h-160">
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2">
        <div className="bg-black bg-opacity-60 rounded-full items-center justify-center mx-auto grid md:h-96 md:w-96 w-72 h-72 relative lg:h-128 lg:w-128">
          <img className="mx-auto md:h-40 h-24 absolute left-1/2 top-1/3 transform -translate-y-1/3 -translate-x-1/2 lg:h-48" src="/nothing-yet-icon.png" alt="" />
          <div className="absolute left-1/2 top-3/4 transform -translate-y-3/4 -translate-x-1/2 w-96 md:-mt-5 -mt-4 lg:-mt-8">
            <h3 className="text-yellow-500 text-center font-semibold lg:text-4xl md:text-2xl text-xl mb-1">Sorry,</h3>
            <p className="text-yellow-500 text-center lg:text-xl md:text-base text-xs">there is nothing here yet in this tab.</p>
          </div>
        </div>
      </div>
    </div>
  );
}