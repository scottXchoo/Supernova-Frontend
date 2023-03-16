import clsx from "clsx";
import { Proposal, ProposalStatusDisplay } from "core/queries/proposal/types";
import { formatTimeDiff } from "core/utils/dateTimeFormat";
import Link from "next/link";
import React from "react";
import ProposalCardTally from "./ProposalCaldTally";

export const proposalCardStatusColor: Record<ProposalStatusDisplay, string> = {
  "Voting Period": "bg-purple-500",
  "Deposit Period": "bg-purple-300",
  "Passed": "bg-yellow-500",
  "Rejected": "bg-gray-700",
  "Failed": "bg-gray-400",
  "All": "bg-balck"
}
export const ProposalCard = ({ overview, tally }: Proposal) => {
  const leftTime = formatTimeDiff(overview.votingEndTime);
  return (
    <Link href={`/governance/proposals/${overview.id}`}>
      <div>
        <div className="md:rounded-t-xl rounded-t-lg bg-white md:px-8 md:py-8 px-5 py-5 lg:w-full w-3/4 mx-auto grid md:w-5/6 cursor-pointer">
          <div className="w-full flex items-center justify-between mb-2">
            <div
              className="rounded-full -mx-1 bg-blue-500 text-xs tracking-tight text-white md:py-1 py-0.5 font-semibold px-2 inline-block justify-self-start md:px-4 lg:text-sm"
              data-config-id="text86"
            >
              {overview.type}
            </div>
            <p
              className="text-black text-right lg:text-lg font-bold md:text-base text-sm mx-1"
              data-config-id="text16"
            >
              #{overview.id}
            </p>
          </div>
          <h2 className="text-left text-black tracking-tight font-semibold break-words text-lg md:text-xl lg:text-2xl md:leading-tight leading-tight lg:leading-tight h-16 line-clamp-2">
            {overview.title}
          </h2>
          <ProposalCardTally id={overview.id} tally={tally} />
        </div>
        <div
          className={clsx(
            "md:rounded-b-xl rounded-b-lg md:px-8 md:py-4 px-5 py-2 flex justify-between items-center lg:w-full w-3/4 mx-auto md:w-5/6",
            proposalCardStatusColor[overview.statusDisplay],
          )}
        >
          <p className="text-black text-left font-semibold text-sm lg:text-2xl md:text-lg">
            {overview.statusDisplay}
          </p>
          {leftTime && (
            <p className="text-black text-right font-medium text-sm lg:text-2xl md:text-lg">
              {leftTime} left
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
