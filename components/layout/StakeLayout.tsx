import React, { ReactNode } from "react";
import { StakeHeader } from "components/stake/StakeHeader";
import { Title } from "components/stake/Title";
import { Footer } from "components/footer/footer";

export const StakeLayout: React.FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <section className="relative bg-clip bg-right-top md:bg-clip md:bg-top md:py-24 py-10 xl:bg-cover bg-black overflow-hidden bg-[url('/background-sm.png')] md:bg-[url('/background.png')] xl:bg-[url('/background-lg.png')]">
        <div className="container w-full items-center mx-auto text-center px-4">
          <Title />
          <StakeHeader />
          {children}
          <Footer />
        </div>
      </section>
    </>
  );
};
