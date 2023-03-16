import AvailableBalance from "./AvailableBalance";
import Rewards from "./Rewards";
import StakedAmount from "./StakedAmount";
import Undelegate from "./Undelegate/Undelegate";

const Dashboard = () => {
  return (
    <div className="block md:mb-16 mb-10">
      <div className="container lg:max-w-5xl mx-auto max-w-md md:max-w-2xl">
        <h3 className="lg:px-6 md:px-5 px-2 font-semibold text-sm md:text-lg lg:text-2xl border-white text-yellow-500 md:mb-4 mb-2">
          Dashboard
        </h3>
        <div className="flex flex-wrap mx-auto mb-10">
          <div className="lg:w-1/4 w-full md:px-2 px-1 lg:mb-0 mb-3">
            <StakedAmount />
            <AvailableBalance />
          </div>
          <Undelegate />
          <Rewards />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
