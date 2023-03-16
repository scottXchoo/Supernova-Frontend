import OgTag from "components/common/OgTag";
import { StakeLayout } from "components/layout/StakeLayout";
import { ClaimModule } from "components/stake/ClaimModule";
import { ReactElement } from "react";

export default function Claim() {
  return <ClaimModule />;
}

Claim.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Claim"
        description="Stake assets at Supernova and earn the maximum returns"
      />
      <StakeLayout>{page}</StakeLayout>
    </>
  );
};
