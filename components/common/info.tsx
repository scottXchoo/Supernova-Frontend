export const exchangeRateText = (
  coinDenomPretty: string,
  snDenomPretty: string,
): string => {
  return `${coinDenomPretty}/${snDenomPretty} exchange rate is determined by a formula: 1 ${snDenomPretty} = (total ${coinDenomPretty} staked + tx fees + compound interest + block rewards) / (total ${snDenomPretty} supply). Because staked ${coinDenomPretty} is earning yield, ${snDenomPretty} grows in value vs. ${coinDenomPretty} over time. When you unstake ${snDenomPretty} to ${coinDenomPretty}, you will receive more ${coinDenomPretty} than you staked before.`;
};

export const unbondingPeriodText = (snDenomPretty: string): string => {
  return `After unstaking, assets need to be unbonded before they are available to withdraw. If you don’t want to wait, you can trade ${snDenomPretty} directly on our Swap page.`;
};
export const InfoIcon = ({ content }: { content: string }) => {
  return (
    <div className="group cursor-pointer relative">
      <div className="whitespace-pre-line absolute z-10 hidden group-hover:block bg-gray-200 w-60 md:w-96 top-4 md:top-5 -translate-x-1/3 md:-translate-x-1/2 rounded items-center text-left p-3 md:p-4 text-gray-700 text-xs md:text-sm font-medium">
        {content}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="md:h-5 md:w-5 h-3 w-3 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        data-config-id="svg-inline15"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </div>
  );
};
