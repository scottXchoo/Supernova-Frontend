import Head from "next/head";
import React from "react";

const DEFAULT_OG_IMAGE = {
  path: "og.png",
  width: "2401", // recommended: 1200
  height: "1261", // recommended: 630
};

type OgTagProps = {
  title: string;
  description: string;
  img?: {
    path: string;
    width: string;
    height: string;
  };
};

const OgTag = ({
  title,
  description,
  img: { path, width, height } = DEFAULT_OG_IMAGE,
}: OgTagProps) => {
  const imagePath = `${process.env.NEXT_PUBLIC_DOMAIN_ADDRESS}/${path}`;
  const ogTitle = `${title} | Supernova`;

  return (
    <Head>
      <title>{ogTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Supernova" />
      <meta property="og:image" content={imagePath} />
      <meta property="og:image:width" content={width} />
      <meta property="og:image:height" content={height}></meta>
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default OgTag;
