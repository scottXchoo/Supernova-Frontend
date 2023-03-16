import clsx from "clsx";
import useProposalVotes from "core/hooks/proposal/useProposalVotes";
import { makeEllipsisText } from "core/utils/makeEllipsisText";

interface VoteTrProps {
  index: number;
  voter: string;
  option: string;
}
const VoteTr = ({ index, voter, option }: VoteTrProps) => {
  return (
    <tr
      className={clsx("lg:text-lg md:text-sm text-xs", {
        "bg-gray-400 bg-opacity-50": index % 2 !== 0,
      })}
    >
      <td className="relative font-medium md:h-16 mb-1 lg:pl-8 lg:pr-5 h-12 md:pl-4 pr-4">
        <div className="flex items-center">
          <div>
            <div className="relative lg:w-12 lg:h-12 w-9 h-9 lg:mr-6 md:mr-3">
              <span
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-black"
                data-config-id="text75"
              >
                {index}
              </span>
            </div>
          </div>
          <span className="text-black font-semibold" data-config-id="text76">
            {makeEllipsisText(voter)}
          </span>
        </div>
      </td>
      <td className="text-black md:h-16 mb-1 py-2 lg:py-3 h-12 md:px-8 px-5 text-center lg:py-4">
        <p className="">
          <span className="font-semibold" data-config-id="text77">
            {option}
          </span>
        </p>
      </td>
    </tr>
  );
};

const Votes = ({ id }: { id: string }) => {
  const { data: votesData, error: votesError } = useProposalVotes(id);
  if (!votesData || votesData.length === 0 || votesError) return null;
  return (
    <div className="flex items-start justify-between w-full md:py-14 py-8 border-b border-gray-700 border-dashed flex-wrap">
      <div className="w-full">
        <h2
          className="text-black md:text-lg text-sm text-left font-semibold lg:text-xl mb-2 lg:mb-6 md:mb-3"
          data-config-id="text25"
        >
          Votes
        </h2>
      </div>
      <nav
        className="hidden w-full items-center justify-start justify-end mb-2 md:mb-3 text-xs flex-wrap md:flex sm:text-base lg:mb-4"
        aria-label="Tabs"
      >
        <a
          href="#"
          className="md:px-4 px-2 text-center border-black text-black text-purple-300 font-bold border-r"
          data-config-id="text109"
        >
          All (2121)
        </a>
        <a
          href="#"
          className="md:px-4 px-2 text-center font-medium border-black text-black border-r"
          data-config-id="text110"
        >
          Yes(1900)
        </a>
        <a
          href="#"
          className="md:px-4 px-2 text-center font-medium border-black text-black border-r"
          data-config-id="text111"
        >
          Abstain(44)
        </a>
        <a
          href="#"
          className="md:px-4 px-2 text-center font-medium border-black text-black border-r"
          aria-current="page"
          data-config-id="text112"
        >
          No(8)
        </a>
        <a
          href="#"
          className="md:px-4 px-2 text-center font-medium text-black"
          data-config-id="text113"
        >
          No+Veto(90)
        </a>
      </nav>
      <div className="flex justify-end w-full md:hidden ">
        <div className="inline-block mb-2 border px-2 border-gray-400 rounded-md py-2">
          <select
            id="status"
            name="status"
            className="block bg-transparent font-heading outline-none ease-in-out duration-300 text-purple-300 font-semibold text-xs"
          >
            <option>All(2121)</option>
            <option>Yes(1900)</option>
            <option>Abstain(44)</option>
            <option>No(8)</option>
            <option>No+Veto(90)</option>
          </select>
        </div>
      </div>
      <div className="w-full mb-2">
        <div className="ml-auto overflow-x-auto">
          <div className="inline-block min-w-full rounded-md bg-gray-300 ">
            <table className="table-auto w-full text-white">
              <thead>
                <tr className="lg:text-lg md:text-sm text-xs">
                  <th
                    className="font-semibold text-black text-left h-10 md:h-14 lg:h-20 md:pl-28 pl-16"
                    data-config-id="text99"
                  >
                    Voter
                  </th>
                  <th
                    className="font-semibold text-black md:h-14 lg:h-20 md:px-8 px-5 text-center"
                    data-config-id="text101"
                  >
                    Option
                  </th>
                </tr>
              </thead>
              <tbody>
                {votesData.map((data, index) => (
                  <VoteTr index={index + 1} key={index} {...data} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center md:text-lg text-sm md:justify-end justify-center md:px-4 px">
        <a
          className="inline-flex mr-2 items-center justify-center bg-white md:h-12 md:w-11 h-8 w-7"
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="md:h-4 md:w-4 h-3 w-3 mt-0.5 transform md:ml-1 ml-0.5 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            data-config-id="svg-inline14"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>
        <a
          className="inline-flex mr-3 items-center justify-center font-bold border rounded-full text-black border-black md:w-11 md:h-11 w-8 h-8"
          href="#"
          data-config-id="text114"
        >
          1
        </a>
        <a
          className="inline-flex mr-3 md:mr-4 items-center justify-center font-bold bg-white rounded-full border border-white hover:border-gray-400 md:w-11 md:h-11 h-8 w-8"
          href="#"
          data-config-id="text115"
        >
          2
        </a>
        <span className="mr-4 inline-block">
          <svg
            width="13"
            height="3"
            viewBox="0 0 13 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=""
            data-config-id="svg-inline15"
          >
            <circle
              opacity="0.8"
              cx="1.5"
              cy="1.5"
              r="1.5"
              fill="#000000"
            ></circle>
            <circle
              opacity="0.8"
              cx="6.5"
              cy="1.5"
              r="1.5"
              fill="#000000"
            ></circle>
            <circle
              opacity="0.8"
              cx="11.5"
              cy="1.5"
              r="1.5"
              fill="#000000"
            ></circle>
          </svg>
        </span>
        <a
          className="inline-flex mr-3 items-center justify-center font-bold bg-white rounded-full border border-white hover:border-gray-400 md:w-11 md:h-11 w-8 h-8"
          href="#"
          data-config-id="text116"
        >
          5
        </a>
        <a
          className="inline-flex mr-2 items-center justify-center font-bold bg-white rounded-full border border-white hover:border-gray-400 md:w-11 md:h-11 h-8 w-8"
          href="#"
          data-config-id="text117"
        >
          6
        </a>
        <a
          className="inline-flex items-center justify-center bg-white md:h-12 md:w-11 h-8 w-7"
          href="#"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="md:h-4 md:w-4 h-3 w-3 mt-0.5 transform -rotate-90 md:ml-1 ml-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            data-config-id="svg-inline16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Votes;
