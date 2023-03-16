import useUnbondingRecords from "core/hooks/validators/useUnbondingRecords";
import { getNovaAddress } from "core/state/coreState";
import { useRecoilValue } from "recoil";
import UndelegateTableRow from "./UndelegateTableRow";

const UndelegateTable = () => {
  const novaAddress = useRecoilValue(getNovaAddress);
  const { data: unbondingData, error: unbondingError } =
    useUnbondingRecords(novaAddress);
  if (!unbondingData || unbondingError) return null;
  return (
    <div className="py-2 overflow-y-scroll lg:h-36 h-28">
      {unbondingData.map((unbondingRecord) => (
        <UndelegateTableRow
          key={unbondingRecord.completionTime}
          {...unbondingRecord}
        />
      ))}
    </div>
  );
};
export default UndelegateTable;
