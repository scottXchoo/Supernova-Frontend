import InsufficientBalance from "components/swap/InsufficientBalance";
import {
  TransactionStatus,
  TransactionType,
  TypeTransactionStatus,
} from "core/state/transaction";
import * as StatusButton from "./StateButton";

export type ButtonStatus = "loading" | "error" | "active" | "disabled";

interface ButtonProps {
  enabled: boolean;
  transactionStatus: TypeTransactionStatus;
  hasValue: boolean;
  isInsufficient?: boolean;
  onClick: () => void;
  buttonText: string;
  buttonType: TransactionType;
}

const Button = ({
  enabled,
  transactionStatus,
  hasValue,
  isInsufficient = false,
  onClick,
  buttonText,
  buttonType,
}: ButtonProps) => {
  if (!enabled) {
    return <StatusButton.ConnectWallet />;
  }

  if (transactionStatus.status == TransactionStatus.EXECUTING) {
    if (transactionStatus.type == buttonType) {
      return <StatusButton.Loading content={buttonText} />;
    } else {
      return <StatusButton.InActive content={buttonText} />;
    }
  } else {
    if (isInsufficient) return <InsufficientBalance />;
    if (hasValue)
      return <StatusButton.Active onClick={onClick} content={buttonText} />;
    else {
      return <StatusButton.InActive content={buttonText} />;
    }
  }
};
export default Button;
