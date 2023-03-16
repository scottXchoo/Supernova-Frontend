/* eslint-disable no-unused-vars */
import { LiquidityLayout } from "components/layout/LiquidityLayout";
import { LiquidityRemoveModule } from "components/swap/LiquidityRemoveModule";
import Head from "next/head";

import { ReactElement } from "react";
export async function getStaticPaths() {
  return {
    paths: [
      { params: { denom: "ATOM" } },
      { params: { denom: "OSMO" } },
      { params: { denom: "JUNO" } },
    ],
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps() {
  return {
    // Passed to the page component as props
    props: { post: {} },
  };
}

export default function Remove() {
  return <LiquidityRemoveModule />;
}

Remove.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Remove liquidity</title>
      </Head>
      <LiquidityLayout>{page}</LiquidityLayout>
    </>
  );
};
