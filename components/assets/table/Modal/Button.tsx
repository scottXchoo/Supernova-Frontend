import InsufficientBalance from "components/swap/InsufficientBalance";
import {
  InactiveButton,
  LoadingButton,
  ActiveButton,
} from "./ButtonComponents";

interface ButtonProps {
  content: string;
  onClick: () => void;
  isOverMax: boolean;
  isActive: boolean;
  isLoading: boolean;
}
const Button = ({
  content,
  isOverMax,
  isActive,
  isLoading,
  onClick,
}: ButtonProps) => {
  if (isOverMax) {
    return <InsufficientBalance />;
  }
  if (isLoading) {
    return <LoadingButton content={content} />;
  }
  if (isActive) {
    return <ActiveButton content={content} onClick={onClick} />;
  } else {
    return <InactiveButton content={content} />;
  }
};
export default Button;
