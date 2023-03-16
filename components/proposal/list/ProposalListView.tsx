import useProposals from "core/hooks/proposal/list/useProposals";
import { Proposal } from "core/queries/proposal/types";
import { proposalFilter } from "core/state/proposal/proposalFilter";
import { useRecoilValue } from "recoil";
import { EmptyDataUI } from "./EmptyDataUI";
import { ProposalCard } from "./ProposalCard";
const ProposalListView = () => {
  const status = useRecoilValue(proposalFilter);
  const { data: proposals, error: proposalsError } = useProposals(status);
  if (proposalsError) return null;
  const isProposalsNotEmpty = proposals && proposals.length > 0;

  return (
    isProposalsNotEmpty ?
      <div className="flex flex-wrap container mx-auto xl:max-w-7xl lg:max-w-5xl md:w-full lg:px-0 md:px-4">
        {proposals.map((proposal: Proposal) => (
          <div key={proposal.overview.id} className="w-full md:w-1/2 lg:px-6">
            <div className="mt-8 lg:mt-16 md:mt-10 lg:max-w-xl mx-auto max-w-lg lg:px-0 md:px-4">
              <ProposalCard {...proposal} />
            </div>
          </div>
        ))}
      </div> :
      <EmptyDataUI />
  );
};
export default ProposalListView;
