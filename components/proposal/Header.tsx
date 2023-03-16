import { formatTimeDiff } from "core/utils/dateTimeFormat";
import useProposal from "core/hooks/proposal/useProposal";
import clsx from "clsx";
import { proposalCardStatusColor } from "./list/ProposalCard";

const Header = ({ id }: { id: string }) => {
  const { data: proposal, error: overviewError } = useProposal(id);
  if (!proposal || overviewError) return null;

  return (
    <div
      className={clsx(
        "md:rounded-t-xl rounded-t-lg md:px-8 px-5 py-2 flex justify-between items-center lg:w-full mx-auto w-full lg:py-4 md:py-3",
        proposalCardStatusColor[proposal.overview.statusDisplay],
      )}
    >
      <p className="text-black text-left font-semibold text-sm md:text-lg lg:text-2xl">
        {proposal.overview.statusDisplay}
      </p>
      <p className="text-black text-right font-medium text-sm lg:text-2xl md:text-lg">
        {formatTimeDiff(proposal.overview.votingEndTime)}
      </p>
    </div>
  );
};

export default Header;
