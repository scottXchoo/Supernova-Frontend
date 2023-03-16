import { useQuery } from "@tanstack/react-query";
import fetchBondedToken from "core/queries/proposal/fetchBondedToken";
import { bondedTokenAtom } from "core/state/proposal/vote/bondedToken";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useBondedToken = (
  bondedToken: string | null = null,
): FetchResult<string> => {
  const [data, setBondedToken] = useRecoilState(bondedTokenAtom);
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bondedToken"],
    queryFn: () => fetchBondedToken(),
    initialData: bondedToken || data,
  });

  useEffect(() => {
    setBondedToken(fetchedData);
  }, [fetchedData]);

  if (isLoading) {
    return {
      data: null,
      isLoading,
      error: null,
    };
  }

  if (error) {
    return {
      data: null,
      isLoading,
      error: error as Error,
    };
  }

  return {
    data,
    isLoading: false,
    error: null,
  };
};
export default useBondedToken;
