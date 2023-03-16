import { useEffect } from "react";
import { toast } from "react-toastify";

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export const handleError = (e: Error) => {
  const message = e.message || DEFAULT_ERROR_MESSAGE;
  toast.error(message);
};

const handleRejection = (event: PromiseRejectionEvent | ErrorEvent) => {
  const error =
    (event as PromiseRejectionEvent).reason || (event as ErrorEvent).error;

  if (error instanceof Error) {
    handleError(error);
  } else {
    handleError(new Error());
  }
};

const AsyncErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.addEventListener("error", handleRejection);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleRejection);
    };
  }, []);

  return <>{children}</>;
};

export default AsyncErrorBoundary;
