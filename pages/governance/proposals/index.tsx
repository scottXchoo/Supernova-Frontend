import OgTag from "components/common/OgTag";
import { GovernanceLayout } from "components/layout/GovernanaceLayout";
import ProposalFilter from "components/proposal/list/ProposalFilter";
import ProposalListView from "components/proposal/list/ProposalListView";
import { ReactElement } from "react";
import ProposalDashboard from "components/proposal/list/ProposalDashboard";

export default function Proposals() {
  return (
    <>
      <ProposalDashboard />
      <ProposalFilter />
      <ProposalListView />
    </>
  );
}

Proposals.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Proposals"
        description="The governance platform for the Supernova"
      />
      <GovernanceLayout titleText={"Proposals"}>{page}</GovernanceLayout>
    </>
  );
};
