import UndelegateTable from "./UndelegateTable";
const Undelegate = () => {
  return (
    <div className="lg:w-1/2 w-full md:px-2 px-1 flex justify-center lg:h-auto h-48 mb-3 lg:mb-0">
      <div className="w-full bg-black bg-opacity-30 border border-gray-200 rounded-xl py-2 px-4">
        <div className="">
          <h4 className="lg:text-sm text-xs text-left font-medium border-b border-gray-200 px-2 text-gray-200 pb-1 mb-2">
            Undelegate
          </h4>
        </div>
        <UndelegateTable />
      </div>
    </div>
  );
};
export default Undelegate;
