import { useChains } from "core/hooks/useChains";
import { useWallet } from "core/hooks/useWallet";
import Image from "next/image";
import { MouseEventHandler } from "react";
import * as gtag from "lib/gtag";

export type ClickHandler = MouseEventHandler<HTMLButtonElement>;

export const Active = ({
  onClick,
  content,
}: {
  onClick?: ClickHandler;
  content: string;
}) => {
  return (
    <button
      className="flex flex-row w-full md:py-4 py-3 px-4 text-center items-center justify-center md:text-2xl md:rounded-xl rounded-lg text-yellow-500 bg-black hover:bg-gray-900 font-semibold transform duration-200 shadow-sm text-lg"
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export const Loading = ({ content }: { content: string }) => {
  return (
    <button className="flex flex-row w-full md:py-4 py-3 px-4 text-center items-center justify-center md:text-2xl md:rounded-xl rounded-lg text-gray-400 bg-black font-semibold transform duration-200 shadow-sm text-lg">
      {content}
      <div className="h-full ml-4 flex items-center animate-spin">
        <Image src={"loading.png"} width={20} height={20} alt={""} />
      </div>
    </button>
  );
};

export const InActive = ({ content }: { content: string }) => {
  return (
    <button className="cursor-not-allowed inline-block w-full md:py-4 py-3 px-4 text-center md:text-2xl md:rounded-xl rounded-lg text-gray-700 bg-gray-400 font-semibold transform duration-200 shadow-sm text-lg">
      {content}
    </button>
  );
};

export const ConnectWallet = ({
  content = "Connect Wallet",
}: {
  content?: string;
}) => {
  const { init } = useChains();
  const { connectWallet } = useWallet();
  const handleConnectWallet = async () => {
    gtag.event({
      action: "click-connect-wallet",
      category: "header",
    });

    await connectWallet();
    await init();

    gtag.event({
      action: "success-connect-wallet",
      category: "header",
    });
  };

  return <Active content={content} onClick={handleConnectWallet} />;
};
