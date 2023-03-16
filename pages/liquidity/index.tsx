import OgTag from "components/common/OgTag";
import { LiquidityLayout } from "components/layout/LiquidityLayout";
import { LiquidityManageModule } from "components/swap/LiquidityManageModule";

import { ReactElement } from "react";

export default function Liquidity() {
  return <LiquidityManageModule />;
}

Liquidity.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <OgTag
        title="Liquidity"
        description="Swap or provide liquidity on the Supernova"
      />
      <LiquidityLayout>{page}</LiquidityLayout>
    </>
  );
};
