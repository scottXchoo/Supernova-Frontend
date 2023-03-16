import React, { useEffect, useState } from "react";
import * as gtag from "lib/gtag";
import Big from "big.js";
import useClaimableAmount from "core/hooks/pools/useClaimableAmount";
import useHarvestMutation from "core/hooks/pools/useHarvestMutation";
import type { ButtonStatus } from "components/common/Button";
import { PoolsButton } from "./Button";
import { InfoIcon } from "components/common/info";
import { PairInfo } from "core/config/pairInfo";
import { NOVA_DECIMAL } from "core/constants/constants";
import { convertBigToFixedString } from "core/utils/numberFormatter";

const MyPoolsInfoHarvest = ({ pair }: { pair: PairInfo }) => {
  const [isValid, setIsValid] = useState<boolean>(false);

  const {
    data: claimableAmount,
    error: claimableAmountError,
    isLoading: isLoadingClaimableAmount,
  } = useClaimableAmount(pair);

  const harvestMutation = useHarvestMutation(pair);

  const handleHarvestButton = async () => {
    gtag.event({
      action: "click-pools-harvest",
      category: "pools",
    });
    harvestMutation.mutate();
  };

  const claimableAmountToBig = Big(claimableAmount || 0);
  useEffect(() => {
    if (claimableAmountToBig.eq(0)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [claimableAmountToBig]);

  let buttonStatus: ButtonStatus;
  if (harvestMutation.status == "loading" || isLoadingClaimableAmount) {
    buttonStatus = "loading";
  } else if (claimableAmountError || isValid === false) {
    buttonStatus = "disabled";
  } else {
    buttonStatus = "active";
  }

  return (
    <>
      <div className="flex-initial col-span-5 mt-5">
        <div className="flex items-center text-purple-500">
          <p className="md:text-xl font-medium text-left xl:text-lg text-sm md:mr-2 mr-1">
            NOVA earned
          </p>
          <InfoIcon content="LP rewards consist of the sum of swap fees and NOVA block rewards. Swap fees can be collected all at once when removing liquidity from a pool, and NOVA block rewards can be obtained by clicking the Harvest button. To receive NOVA block rewards, stake LP tokens." />
        </div>
        <h3 className="text-black md:text-2xl text-lg text-left truncate font-semibold leading-tight xl:text-xl">
          {convertBigToFixedString(
            claimableAmountToBig.div(Math.pow(10, NOVA_DECIMAL)),
            NOVA_DECIMAL,
          )}
        </h3>
      </div>
      <div className="justify-end col-span-3 md:pl-4 pl-1.5 mt-5">
        <PoolsButton
          content="Harvest"
          status={buttonStatus}
          onClick={handleHarvestButton}
        />
      </div>
    </>
  );
};

export default MyPoolsInfoHarvest;
