import OgTag from "components/common/OgTag";
import { StakeLayout } from "components/layout/StakeLayout";
import { UnstakeModule } from "components/stake/UnstakeModule";
import { ReactElement } from "react";

export default function Unstake() {
  return <UnstakeModule />;
}

Unstake.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Unstake"
        description="Stake assets at Supernova and earn the maximum returns"
      />
      <StakeLayout>{page}</StakeLayout>
    </>
  );
};
