import Modal from "components/common/Modal";
import { modalsAtom } from "core/state/validators/delegate/delegateModal";
import {
  redelegateFromAddressAtom,
  redelegateToAddressAtom,
} from "core/state/validators/delegate/redelegation";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import AddDelegation from "./component/AddDelegation";
import Delegation from "./component/Delegation";
import ManageMyValidator from "./component/ManageMyValidator";
import ManageValidator from "./component/ManageValidator";
import RedelegateFromList from "./component/Redelegation/RedelegateFromList";
import RedelegateFromTo from "./component/Redelegation/RedelegateFromTo";
import RedelegateTo from "./component/Redelegation/RedelegateTo";
import RedelegateToList from "./component/Redelegation/RedelegateToList";
import Undelegation from "./component/Undelegation";

const DelegationModal = () => {
  const closeAllModal = useResetRecoilState(modalsAtom);
  const setRedelegateFromAddress = useSetRecoilState(redelegateFromAddressAtom);
  const setRedelegateToAddress = useSetRecoilState(redelegateToAddressAtom);
  const { baseModal } = useRecoilValue(modalsAtom);

  const handleOnClose = () => {
    closeAllModal();
    setRedelegateFromAddress("");
    setRedelegateToAddress("");
  };

  return (
    <Modal isOpen={baseModal} onClose={handleOnClose}>
      <div className="bg-black grid rounded-xl border-yellow-500 z-10 overflow-hidden md:rounded-2xl border-2 transition-all w-full">
        <ManageMyValidator />
        <ManageValidator />
        <Undelegation />
        <Delegation />
        <AddDelegation />
        <RedelegateFromList />
        <RedelegateToList />
        <RedelegateTo />
        <RedelegateFromTo />
      </div>
    </Modal>
  );
};
export default DelegationModal;
