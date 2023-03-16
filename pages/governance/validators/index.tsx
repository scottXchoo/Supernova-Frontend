import OgTag from "components/common/OgTag";
import { GovernanceLayout } from "components/layout/GovernanaceLayout";
import Dashboard from "components/validators/dashboard/Dashboard";
import MyValidators from "components/validators/MyValidators";
import ValidatorLists from "components/validators/ValidatorLists";
import { ReactElement } from "react";

export default function Validators() {
  return (
    <>
      <Dashboard />
      <MyValidators />
      <ValidatorLists />
    </>
  );
}

Validators.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Validators"
        description="The governance platform for the Supernova"
      />
      <GovernanceLayout titleText={"Validators"}>{page}</GovernanceLayout>
    </>
  );
};
