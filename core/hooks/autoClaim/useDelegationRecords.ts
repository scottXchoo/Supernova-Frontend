import { useQuery } from "@tanstack/react-query";
import { fetchDelegateRecordsToVerionInfo } from "core/queries/autoClaim/fetchDelegateRecordsVersionInfo";

const useDelegationRecords = ({
  address,
  zoneID,
}: {
  address: string;
  zoneID: string;
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["delegateRecordsToVersionInfo", address, zoneID],
    queryFn: () => fetchDelegateRecordsToVerionInfo(address, zoneID),
    enabled: !!address && !!zoneID,
  });

  return {
    data,
    error,
    isLoading,
  };
};

export default useDelegationRecords;
