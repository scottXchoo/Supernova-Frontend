import { swapAtom } from "core/state/swapState";
import { useRecoilValue } from "recoil";

const SwapTitle = () => {
  const [fromToken, toToken] = useRecoilValue(swapAtom);
  return (
    <div className="max-w-xl mx-auto text-center md:mb-10 mb-5">
      <h2 className="mb-2 md:text-4xl text-3xl text-yellow-500 font-semibold">{`Swap ${fromToken.denom}`}</h2>
      <p className="text-sm text-white md:text-base">{`Swap ${fromToken.denom} and ${toToken.denom} in seconds`}</p>
    </div>
  );
};

export default SwapTitle;
