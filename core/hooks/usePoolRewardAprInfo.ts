import Big from "big.js";
import useCoinApy from "./priceFeeder/useCoinApy";
import { zoneIdByDisplayDenomMap } from "core/utils/DenomMap";
import {
  GAIA_NOVA_REWARD,
  JUNO_NOVA_REWARD,
  OSMOSIS_NOVA_REWARD,
  SWAP_FEE,
} from "core/utils/constants";

export const usePoolRewardAprInfo = (displayDenom: string) => {
  const zoneName = zoneIdByDisplayDenomMap[displayDenom];

  let novaReward;
  switch (zoneName) {
    case "gaia":
      novaReward = GAIA_NOVA_REWARD;
      break;
    case "osmosis":
      novaReward = OSMOSIS_NOVA_REWARD;
      break;
    case "juno":
      novaReward = JUNO_NOVA_REWARD;
      break;
  }

  const aprParameter = "nova";
  const novaAPR = useCoinApy(aprParameter);
  const novaPercent = Big(novaAPR.data?.percent || 0);
  const poolAPR = Big(novaReward || "0")
    .div(100)
    .mul(novaPercent);
  const poolInfo = `- Swap transaction fee rewards (${SWAP_FEE}%)\n- NOVA rewards (n%; ${novaReward}% of newly minted NOVA)`;

  return { poolAPR, poolInfo };
};
