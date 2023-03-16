import React, { ReactNode } from "react";

export const GovernanceLayout: React.FC<{
  children?: ReactNode;
  titleText: string;
}> = ({ children, titleText }) => {
  return (
    <section className="flex flex-grow flex-col">
      <section className="relative bg-black md:py-24 lg:py-20 py-14 overflow-visible xl:py-28 flex justify-center bg-[url('https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/web-bg-v2.png')] bg-no-repeat">
        <div className="absolute lg:bottom-32 lg:w-full flex md:w-160 bottom-32 w-72 z-20 justify-end right-0 xl:right-80">
          <img
            className="object-contain"
            src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/logo.png"
            alt=""
          />
        </div>
        <img
          className="absolute bottom-0 right-0 lg:h-full md:h-3/4 h-2/3"
          src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/eclipse-v2.png"
          alt=""
        />
        <img
          className="absolute left-0 bottom-0 z-10 lg:h-auto md:h-1/2 h-1/2 w-full"
          src="https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/gradient.png"
          alt=""
        />
        <div className="relative container mx-auto px-4 py-12 lg:py-32 xl:max-w-6xl">
          <div className="flex flex-wrap -mx-4 items-center">
            <div className="w-full lg:w-1/2 px-4 mb-8 lg:mb-0 md:px-10">
              <h2 className="md:max-w-md md:text-4xl text-yellow-500 font-semibold mb-2 text-2xl">
                {titleText}
              </h2>
              <p className="mb-20 max-w-sm text-white font-medium leading-normal ml-1 text-sm">
                Supernova is managed by a decentralized community of NOVA
                token-holders and their delegates, who propose and vote on
                upgrades to the protocol.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black relative h-full flex flex-col flex-grow py-16 md:py-24 bg-[url('https://static.shuffle.dev/uploads/files/aa/aa3e9a0b09b50e73b38bc67159f4f554912935d1/bg1.png')] bg-no-repeat bg-top w-full bg-[size:100vw]">
        {children}
      </section>
    </section>
  );
};
