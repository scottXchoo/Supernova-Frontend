import clsx from "clsx";
import { proposalStatusCode } from "core/queries/proposal/types";
import { proposalFilter } from "core/state/proposal/proposalFilter";
import { useRecoilState } from "recoil";

const ProposalFilter = () => {
  const [status, setStatus] = useRecoilState(proposalFilter);
  return (
    <div className="block">
      <nav
        className="flex container xl:max-w-6xl lg:max-w-5xl items-center mx-auto justify-center max-w-md"
        aria-label="Tabs"
      >
        <button
          onClick={() =>
            setStatus(proposalStatusCode.PROPOSAL_STATUS_UNSPECIFIED)
          }
          className={clsx(
            "lg:px-6 md:px-5 px-2 text-center font-semibold text-sm md:text-xl lg:text-3xl border-r-2 border-white",
            status === proposalStatusCode.PROPOSAL_STATUS_UNSPECIFIED
              ? "text-yellow-500"
              : "text-white",
          )}
        >
          All
        </button>
        <button
          onClick={() =>
            setStatus(proposalStatusCode.PROPOSAL_STATUS_DEPOSIT_PERIOD)
          }
          className={clsx(
            "lg:px-6 md:px-5 px-2 text-center font-semibold text-sm md:text-xl lg:text-3xl border-r-2 border-white",
            status === proposalStatusCode.PROPOSAL_STATUS_DEPOSIT_PERIOD
              ? "text-yellow-500"
              : "text-white",
          )}
        >
          Pending
        </button>
        <button
          onClick={() =>
            setStatus(proposalStatusCode.PROPOSAL_STATUS_VOTING_PERIOD)
          }
          className={clsx(
            "lg:px-6 md:px-5 px-2 text-center font-semibold text-sm md:text-xl lg:text-3xl border-r-2 border-white",
            status === proposalStatusCode.PROPOSAL_STATUS_VOTING_PERIOD
              ? "text-yellow-500"
              : "text-white",
          )}
        >
          Voting
        </button>

        <button
          onClick={() => setStatus(proposalStatusCode.PROPOSAL_STATUS_PASSED)}
          className={clsx(
            "lg:px-6 md:px-5 px-2 text-center font-semibold text-sm md:text-xl lg:text-3xl border-r-2 border-white",
            status === proposalStatusCode.PROPOSAL_STATUS_PASSED
              ? "text-yellow-500"
              : "text-white",
          )}
        >
          Passed
        </button>
        <button
          onClick={() => setStatus(proposalStatusCode.PROPOSAL_STATUS_REJECTED)}
          className={clsx(
            "lg:px-6 md:px-5 px-2 text-center font-semibold text-sm md:text-xl lg:text-3xl",
            status === proposalStatusCode.PROPOSAL_STATUS_REJECTED
              ? "text-yellow-500"
              : "text-white",
          )}
        >
          Rejected
        </button>
      </nav>
    </div>
  );
};
export default ProposalFilter;
