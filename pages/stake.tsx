import OgTag from "components/common/OgTag";
import { StakeLayout } from "components/layout/StakeLayout";
import { StakeModule } from "components/stake/StakeModule";
import React, { ReactElement } from "react";

export default function Stake() {
  return <StakeModule />;
}

Stake.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Stake"
        description="Stake assets at Supernova and earn the maximum returns"
      />
      <StakeLayout>{page}</StakeLayout>
    </>
  );
};
