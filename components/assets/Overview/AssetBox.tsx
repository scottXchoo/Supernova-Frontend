import { ReactNode } from "react";

interface AssetBoxProps {
  title: string;
  children: ReactNode;
}
const AssetBox = ({ title, children }: AssetBoxProps) => {
  return (
    <div className="mb-4 md:px-2 flex justify-center px-1 lg:w-1/4">
      <div className="text-center border border-yellow-500 px-6 py-8 rounded-xl grid w-full">
        <div className="relative flex justify-start items-end">
          <h3 className="relative text-2xl text-white font-extrabold">
            {children}
          </h3>
        </div>
        <p className="lg:text-sm text-xs text-left font-medium text-gray-700">
          {title}
        </p>
      </div>
    </div>
  );
};
export default AssetBox;
