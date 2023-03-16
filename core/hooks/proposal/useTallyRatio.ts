import Big from "big.js";
import { Tally } from "core/queries/proposal/types";
import { convertBigToFixedString } from "core/utils/numberFormatter";
import useBondedToken from "./useBondedToken";
import useProposalTally from "./useProposalTally";

interface TallyRatio {
  totalBondedToken: Big;
  tallyRatio: {
    totalTally: Big;
    tally: {
      yes: Big;
      no: Big;
      abstain: Big;
      noWithVeto: Big;
    };
    ratio: {
      yesRatio: Big;
      noRatio: Big;
      abstainRatio: Big;
      noWithVetoRatio: Big;
    };
    width: {
      yesWidth: string;
      noWidth: string;
      noWithVetoWidth: string;
      abstaiWidth: string;
    };
  };
}

const EMPTY_TALLY = {
  totalTally: Big(0),
  tally: {
    yes: Big(0),
    no: Big(0),
    abstain: Big(0),
    noWithVeto: Big(0),
  },
  ratio: {
    yesRatio: Big(0),
    noRatio: Big(0),
    abstainRatio: Big(0),
    noWithVetoRatio: Big(0),
  },
  width: {
    yesWidth: "0",
    noWidth: "0",
    noWithVetoWidth: "0",
    abstaiWidth: "0",
  },
};

const useTallyRatio = (
  id: string,
  tally: Tally | null = null,
  bondedToken: string | null = null,
): TallyRatio | null => {
  const { data: bondedTokenData, error: bondedTokenError } =
    useBondedToken(bondedToken);
  const enabled = !tally;
  const { data: tallyData, error: tallyError } = useProposalTally(id, enabled);
  if (!tallyData || tallyError || !bondedTokenData || bondedTokenError)
    return null;
  const yes = Big(tallyData.yes);
  const no = Big(tallyData.no);
  const abstain = Big(tallyData.abstain);
  const noWithVeto = Big(tallyData.noWithVeto);
  const totalTally = yes.add(no).add(abstain).add(noWithVeto);
  const totalBondedToken = Big(bondedTokenData);
  if (totalTally.eq(0))
    return {
      totalBondedToken,
      tallyRatio: EMPTY_TALLY,
    };

  const yesRatio = yes.div(totalBondedToken).mul(100);
  const noRatio = no.div(totalBondedToken).mul(100);
  const noWithVetoRatio = noWithVeto.div(totalBondedToken).mul(100);
  const abstainRatio = abstain.div(totalBondedToken).mul(100);

  const yesWidth = yesRatio;
  const noWidth = yesWidth.add(noRatio);
  const noWithVetoWidth = noWidth.add(noWithVetoRatio);
  const abstainWidth = noWithVetoWidth.add(abstainRatio);

  return {
    totalBondedToken,
    tallyRatio: {
      totalTally,
      tally: {
        yes,
        no,
        abstain,
        noWithVeto,
      },
      ratio: {
        yesRatio,
        noRatio,
        abstainRatio,
        noWithVetoRatio,
      },
      width: {
        yesWidth: convertBigToFixedString(yesWidth, 2),
        noWidth: convertBigToFixedString(noWidth, 2),
        noWithVetoWidth: convertBigToFixedString(noWithVetoWidth, 2),
        abstaiWidth: convertBigToFixedString(abstainWidth, 2),
      },
    },
  };
};

export default useTallyRatio;
