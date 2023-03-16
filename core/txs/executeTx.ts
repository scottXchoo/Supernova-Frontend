import {
  DeliverTxResponse,
  SigningStargateClient,
  StdFee,
} from "@cosmjs/stargate";
import { toast } from "react-toastify";
import { captureException } from "@sentry/nextjs";
import { SigningCosmWasmClient } from "cosmwasm";

type MsgType = {
  typeUrl: string;
  value: unknown;
};

const userFriendlyMessageMap = {
  "Request rejected": {
    message: "The transaction request has been rejected.",
    shouldCapture: false,
  },
  "code 11": {
    message:
      "Failed to send transaction! Set a higher value than gasUsed in [Advanced] and execute the transaction.",
    shouldCapture: true,
  },
  "code 32": {
    message: "Failed to send transaction! Please resend the transaction.",
    shouldCapture: true,
  },
  "code 5": {
    message: "Failed to send transaction! Please check your balance.",
    shouldCapture: true,
  },
  "Failed to fetch": {
    message: "Wallet connection failed! Please reconnect your wallet.",
    shouldCapture: true,
  },
  "too many deposit request": {
    message:
      "Failed to send transaction! You have exceeded the number of stakes that can be requested for this batch.",
    shouldCapture: true,
  },
  "too many undelegate request": {
    message:
      "Failed to send transaction! You have exceeded the number of unstakes you can request for this batch.",
    shouldCapture: true,
  },
  "minimum input is": {
    message:
      "Failed to send transaction! Please enter a value greater than 0.000000000001 snATOM.",
    shouldCapture: true,
  },
  "no withdraw history for this account": {
    message:
      "Failed to send transaction! There is no unstake history requested.",
    shouldCapture: true,
  },
  "Operation exceeds max spread limit": {
    message:
      "Failed to send transaction! Please set a higher slippage tolerance higher than the current value.",
    shouldCapture: true,
  },
};

const DEFAULT_ERROR_MESSAGE = "Something went wrong";
const getUserFriendlyMessage = (
  message: string,
): {
  message: string;
  shouldCapture: boolean;
} => {
  const userFriendlyMessageFound = Object.entries(userFriendlyMessageMap).find(
    ([partialMessage]) => message.includes(partialMessage),
  );

  if (!userFriendlyMessageFound) {
    return {
      message: DEFAULT_ERROR_MESSAGE,
      shouldCapture: true,
    };
  }

  const [, userFriendlyMessage] = userFriendlyMessageFound;
  return userFriendlyMessage;
};

const executeTx = async (
  messages: MsgType[],
  client: SigningCosmWasmClient | SigningStargateClient,
  address: string,
  fee: number | StdFee | "auto",
): Promise<DeliverTxResponse | null> => {
  let result;
  try {
    result = await toast.promise(
      client.signAndBroadcast(address, messages, fee),
      {
        pending: "Tx Broadcasting...",
      },
    );
  } catch (e) {
    const { message, shouldCapture } = getUserFriendlyMessage(
      (e as Error).message || "",
    );

    toast.error(message);
    if (shouldCapture) {
      captureException(e);
    }

    return null;
  }

  if (result.code === 0) {
    toast.success("Tx Success 👌");
  } else {
    toast.error(result.rawLog);
    captureException(new Error(result.rawLog));
  }

  return result;
};

export default executeTx;
