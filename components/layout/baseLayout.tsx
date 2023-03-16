import React, { ReactNode } from "react";
import GlobalMenu from "components/GlobalMenu";
import ChainAlert from "components/chainAlert";

export const BaseLayout: React.FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <section className="flex flex-col min-h-screen">
      <GlobalMenu />
      <ChainAlert />
      {children}
    </section>
  );
};
