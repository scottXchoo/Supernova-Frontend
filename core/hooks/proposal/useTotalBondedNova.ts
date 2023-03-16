import { useQuery } from "@tanstack/react-query";
import fetchBondedToken from "core/queries/proposal/fetchBondedToken";

const useTotalBondedNova = () => {
  const {
    data: totalBondedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bondedToken"],
    queryFn: () => fetchBondedToken(),
  });

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
    data: totalBondedData,
    isLoading: false,
    error: null,
  };
};
export default useTotalBondedNova;
