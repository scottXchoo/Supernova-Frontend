import { PRICE_FEEDER_BASE_URL } from "core/constants/urlConstants";

export type Price = {
  name: string;
  usd: number;
};
const fetchCoinPrice = async (zoneName: string): Promise<Price | null> => {
  const fetchPrice = await fetch(
    `${PRICE_FEEDER_BASE_URL}/coins/${zoneName}/price`,
  );

  const data = await fetchPrice.json();

  const { Name: name, USD: usd } = data;

  return {
    name,
    usd,
  };
};

export default fetchCoinPrice;
