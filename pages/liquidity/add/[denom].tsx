/* eslint-disable no-unused-vars */
import { LiquidityLayout } from "components/layout/LiquidityLayout";
import { LiquidityAddModule } from "components/swap/LiquidityAddModule";
import Head from "next/head";
import { useRouter } from "next/router";

import { ReactElement, useEffect, useState } from "react";
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
export default function Add() {
  const router = useRouter();
  const [denom, setDenom] = useState<string | string[]>();
  const [snDenom, setSnDenom] = useState<string | string[]>();
  useEffect(() => {
    if (!router.query) {
      return;
    }
    const { denom, snDenom } = router.query;

    setDenom(denom);
    setSnDenom(snDenom);
  }, [router.query]);

  if (!denom || !snDenom) return null;
  return (
    <LiquidityAddModule denom={denom as string} snDenom={snDenom as string} />
  );
}

Add.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Add liquidity</title>
      </Head>
      <LiquidityLayout>{page}</LiquidityLayout>
    </>
  );
};
