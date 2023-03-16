import clsx from "clsx";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import ReactModal from "react-modal";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  bodyOpenClassName?: string;
  overlayClassName?: string;
  children: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  className,
  bodyOpenClassName,
  overlayClassName,
  children,
}: ModalProps) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={(e) => {
        e.preventDefault();
        onClose();
      }}
      bodyOpenClassName={clsx("overflow-hidden", bodyOpenClassName)}
      overlayClassName={clsx(
        "fixed flex items-center inset-0 justify-center bg-black bg-opacity-80 z-20",
        overlayClassName,
      )}
      className={clsx(
        "absolute md:mx-auto mx-7 justify-center rounded-3xl sm:mx-auto md:max-w-lg max-w-md w-full outline-none",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.2,
        }}
      >
        {children}
      </motion.div>
    </ReactModal>
  );
};

export default Modal;
