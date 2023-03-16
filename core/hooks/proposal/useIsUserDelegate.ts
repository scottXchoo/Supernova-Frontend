import { useQuery } from "@tanstack/react-query";
import fetchIsUserDelegate from "core/queries/proposal/fetchIsUserDelegation";
import { isUserDelegateAtom } from "core/state/proposal/vote/isUserDelegate";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { FetchResult } from "./type";

const useIsUserDelegate = (
  address: string,
  isUserDelegate: boolean | null = null,
): FetchResult<boolean> => {
  const [data, setIsUserDelegate] = useRecoilState(isUserDelegateAtom);

  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["isUserDelegate", address],
    queryFn: () => fetchIsUserDelegate(address),
    initialData: isUserDelegate || data,
    enabled: !!address,
  });

  useEffect(() => {
    setIsUserDelegate(fetchedData);
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
export default useIsUserDelegate;
