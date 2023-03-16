import { proposalOverviewFamily } from "core/state/proposal/proposalDetails";
import { useRecoilValue, useSetRecoilState } from "recoil";
import FullDescriptionModal from "./FullDescriptionModal";
import { isFullDescriptionModalOpenAtom } from "core/state/proposal/isFullDescriptionModalOpen";
import MarkDownComponent from "./MarkDownComponent";

const Description = ({ id }: { id: string }) => {
  const setIsOpen = useSetRecoilState(isFullDescriptionModalOpenAtom);
  const proposalOverview = useRecoilValue(proposalOverviewFamily(id));
  if (!proposalOverview) return null;
  return (
    <div className="flex items-start justify-between w-full md:py-14 py-8 border-gray-700 flex-wrap">
      <div className="lg:w-1/3 w-full">
        <h2 className="text-black md:text-lg text-sm text-left font-semibold lg:text-xl lg:mb-0 md:mb-6 mb-4">
          Description
        </h2>
      </div>
      <div className="flex flex-wrap justify-end w-full lg:w-2/3 rounded-md px-4 py-4 shadow-sm md:py-5 md:px-7">
        <div className="w-full mt-2 md:-mr-1 md:mb-4 mb-3">
          <article className="prose prose-sm prose-a:break-words max-w-full line-clamp-6">
            <MarkDownComponent
              content={proposalOverview.description.replaceAll("\\n", "\n")}
            />
          </article>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-right flex items-center justify-end text-black group group-hover transform transition ease-in-out hover:scale-105 lg:mx-4 mx-2"
        >
          <span className="md:text-sm text-xs font-medium">
            View full description
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="md:h-4 md:w-4 h-3 w-3 mt-0.5 transform -rotate-90 md:ml-1 ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <FullDescriptionModal>
          <article className="prose prose-sm max-w-[80vw] w-[80vw]">
            <MarkDownComponent
              content={proposalOverview.description.replaceAll("\\n", "\n")}
            />
          </article>
        </FullDescriptionModal>
      </div>
    </div>
  );
};

export default Description;
