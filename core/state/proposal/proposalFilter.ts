import {
  proposalStatusCode,
  ProposalStatusCode,
} from "core/queries/proposal/types";
import { atom } from "recoil";

export const proposalFilter = atom<ProposalStatusCode>({
  key: "proposalFilter",
  default: proposalStatusCode.PROPOSAL_STATUS_UNSPECIFIED,
});
