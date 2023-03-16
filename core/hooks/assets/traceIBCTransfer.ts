import { DeliverTxResponse } from "@cosmjs/stargate";
import { TxTracer } from "core/utils/tx/tracer";

export const WEBSOCKET_ENDPOENT = "/websocket";
export const SEND_PACKET_KEY = "send_packet";
export const PACKET_SEQUENCE_KEY = "packet_sequence";
export const PACKET_DST_CHANNEL_KEY = "packet_dst_channel";
export const ACKNOWLEDGE_PACKET_KEY = "acknowledge_packet";
export const TM_EVENT_KEY = "tm.event";

export type RawLog = {
  events: Event[];
};

export type Event = {
  attributes: Array<{
    key: string;
    value: string;
  }>;
  type: string;
};

const traceIBCTransfer = async (
  rpc: string,
  result: DeliverTxResponse,
  onSuccess?: () => Promise<void> | void,
  onError?: () => void,
) => {
  const rawLogs: RawLog[] = JSON.parse(result.rawLog || "");
  const sendPacketEvent = rawLogs[0].events.find(
    (e) => e.type === SEND_PACKET_KEY,
  )?.attributes;
  const packetSequence = sendPacketEvent?.find(
    (e) => e.key === PACKET_SEQUENCE_KEY,
  )?.value;

  const packetDstChannel = sendPacketEvent?.find(
    (e) => e.key === PACKET_DST_CHANNEL_KEY,
  )?.value;

  if (!sendPacketEvent || !packetSequence || !packetDstChannel) {
    onError?.();
    return;
  }
  const txTracer = new TxTracer(rpc, WEBSOCKET_ENDPOENT);
  const packetDstChannelQueryKey = `${ACKNOWLEDGE_PACKET_KEY}.${PACKET_DST_CHANNEL_KEY}`;
  const packetSequenceQueryKey = `${ACKNOWLEDGE_PACKET_KEY}.${PACKET_SEQUENCE_KEY}`;
  return txTracer
    .traceTx({
      [packetDstChannelQueryKey]: packetDstChannel,
      [packetSequenceQueryKey]: packetSequence,
      [TM_EVENT_KEY]: "Tx",
    })
    .then(() => {
      txTracer.close();
      onSuccess?.();
    });
};
export default traceIBCTransfer;
