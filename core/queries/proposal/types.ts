export type ProposalStatus =
  | "PROPOSAL_STATUS_UNSPECIFIED"
  | "PROPOSAL_STATUS_DEPOSIT_PERIOD"
  | "PROPOSAL_STATUS_VOTING_PERIOD"
  | "PROPOSAL_STATUS_PASSED"
  | "PROPOSAL_STATUS_REJECTED"
  | "PROPOSAL_STATUS_FAILED";

export type ProposalTypeUrl =
  | "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal"
  | "/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal"
  | "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal"
  | "/cosmos.distribution.v1beta1.CommunityPoolSpendProposalWithDeposit"
  | "/cosmos.gov.v1beta1.TextProposal"
  | "/ibc.core.client.v1.ClientUpdateProposal"
  | "/ibc.core.client.v1.UpgradeProposal"
  | "/cosmos.params.v1beta1.ParameterChangeProposal"
  | "/cosmos.params.v1beta1.ParamChange"
  | "/nova.icacontrol.v1.ZoneRegisterProposal"
  | "/nova.poolincentive.v1.ReplacePoolIncentivesProposal"
  | "/nova.poolincentive.v1.ReplacePoolIncentivesProposal"
  | "/cosmwasm.wasm.v1.StoreCodeProposal"
  | "/cosmwasm.wasm.v1.InstantiateContractProposal"
  | "/cosmwasm.wasm.v1.MigrateContractProposal"
  | "/cosmwasm.wasm.v1.SudoContractProposal"
  | "/cosmwasm.wasm.v1.ExecuteContractProposal"
  | "/cosmwasm.wasm.v1.UpdateAdminProposal"
  | "/cosmwasm.wasm.v1.ClearAdminProposal"
  | "/cosmwasm.wasm.v1.PinCodesProposal"
  | "/cosmwasm.wasm.v1.UnpinCodesProposal"
  | "/cosmwasm.wasm.v1.AccessConfigUpdate"
  | "/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal"
  | "/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal";

export const proposalTypeDisplay: Record<ProposalTypeUrl, string> = {
  "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal": "SoftwareUpgrade",
  "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal":
    "CommunityPoolSpend",
  "/cosmos.gov.v1beta1.TextProposal": "Text",
  "/ibc.core.client.v1.ClientUpdateProposal": "ClientUpdate",
  "/cosmos.params.v1beta1.ParameterChangeProposal": "ParameterChange",
  "/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal":
    "CancelSoftwareUpgrade",
  "/cosmos.distribution.v1beta1.CommunityPoolSpendProposalWithDeposit":
    "CommunityPoolSpendProposalWithDeposit",
  "/ibc.core.client.v1.UpgradeProposal": "Upgrade",
  "/cosmos.params.v1beta1.ParamChange": "ParamChange",
  "/nova.icacontrol.v1.ZoneRegisterProposal": "ZoneRegister",
  "/nova.poolincentive.v1.ReplacePoolIncentivesProposal":
    "ReplacePoolIncentives",
  "/cosmwasm.wasm.v1.StoreCodeProposal": "StoreCode",
  "/cosmwasm.wasm.v1.InstantiateContractProposal": "InstantiateContract",
  "/cosmwasm.wasm.v1.MigrateContractProposal": "MigrateContract",
  "/cosmwasm.wasm.v1.SudoContractProposal": "SudoContract",
  "/cosmwasm.wasm.v1.ExecuteContractProposal": "ExecuteContract",
  "/cosmwasm.wasm.v1.UpdateAdminProposal": "UpdateAdmin",
  "/cosmwasm.wasm.v1.ClearAdminProposal": "ClearAdmin",
  "/cosmwasm.wasm.v1.PinCodesProposal": "PinCodes",
  "/cosmwasm.wasm.v1.UnpinCodesProposal": "UnpinCodes",
  "/cosmwasm.wasm.v1.AccessConfigUpdate": "AccessConfigUpdate",
  "/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal":
    "UpdateInstantiateConfig",
  "/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal":
    "StoreAndInstantiateContract",
};

export type ProposalStatusDisplay =
  | "All"
  | "Deposit Period"
  | "Voting Period"
  | "Passed"
  | "Rejected"
  | "Failed";
export const proposalStatusDisplay: Record<
  ProposalStatus,
  ProposalStatusDisplay
> = {
  PROPOSAL_STATUS_UNSPECIFIED: "All",
  PROPOSAL_STATUS_DEPOSIT_PERIOD: "Deposit Period",
  PROPOSAL_STATUS_VOTING_PERIOD: "Voting Period",
  PROPOSAL_STATUS_PASSED: "Passed",
  PROPOSAL_STATUS_REJECTED: "Rejected",
  PROPOSAL_STATUS_FAILED: "Failed",
};

export type ProposalStatusCode = 0 | 1 | 2 | 3 | 4 | 5;

export const proposalStatusCode: Record<ProposalStatus, ProposalStatusCode> = {
  PROPOSAL_STATUS_UNSPECIFIED: 0,
  PROPOSAL_STATUS_DEPOSIT_PERIOD: 1,
  PROPOSAL_STATUS_VOTING_PERIOD: 2,
  PROPOSAL_STATUS_PASSED: 3,
  PROPOSAL_STATUS_REJECTED: 4,
  PROPOSAL_STATUS_FAILED: 5,
};

export type ProposalOverview = {
  id: string;
  status: ProposalStatus;
  statusDisplay: ProposalStatusDisplay;
  title: string;
  type: string;
  description: string;
  submitTime: string;
  depositEndTime: string;
  votingStartTime: string;
  votingEndTime: string;
};
export type Tally = {
  yes: string;
  no: string;
  abstain: string;
  noWithVeto: string;
};

export type ProposalDeposits = {
  depositor: string;
};

export type Votes = {
  voter: string;
  option: string;
};

export type Proposal = {
  overview: ProposalOverview;
  tally: Tally | null;
};
