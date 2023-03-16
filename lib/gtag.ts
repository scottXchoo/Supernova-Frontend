export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS; // 측정ID 설정: .env 파일로 관리해도된다.

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  window.gtag("config", GA_TRACKING_ID as string, {
    page_path: url,
  });
};

export type Category =
  | "stake"
  | "unstake"
  | "claim"
  | "swap"
  | "liquidity"
  | "pools"
  | "footer"
  | "header"
  | "header-mobile"
  | "stake-lp"
  | "unstake-lp"
  | "delegate"
  | "undelegate";
// https://developers.google.com/analytics/devguides/collection/gtagjs/events
type GTagEvent = {
  action: string;
  category: Category;
  label?: string;
  value?: number | string;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: "testnet" || label,
    value: value,
  });
};
