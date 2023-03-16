import { PRICE_FEEDER_BASE_URL } from "core/constants/urlConstants";

export type Apy = {
  name: string;
  percent: number;
};
const fetchCoinApy = async (zoneName: string): Promise<Apy | null> => {
  const fetchApy = await fetch(
    `${PRICE_FEEDER_BASE_URL}/coins/${zoneName}/apy`,
  );

  const data = await fetchApy.json();

  const { Name: name, Percent: percent } = data;

  return {
    name,
    percent,
  };
};

export default fetchCoinApy;
