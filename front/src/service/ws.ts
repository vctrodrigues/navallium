import { v4 as uuid } from "uuid";
import { deserialize, serialize } from "@/utils";
import type { WebSocketData } from "@/types/ws";

const _getSession = () => {
  const session = sessionStorage.getItem("id") ?? uuid();

  sessionStorage.clear();
  sessionStorage.setItem("id", session);

  return session;
};

const instance = new WebSocket(
  `ws://192.168.0.4:8080?session=${_getSession()}`
);

export const ws: {
  callbacks: Record<string, <Data>(data: WebSocketData<Data>) => void>;
  connect: () => void;
  send: <Data>(event: string, data: Data) => void;
  on: (
    event: string,
    callback: <Data>(data: WebSocketData<Data>) => void
  ) => void;
} = {
  callbacks: {},
  connect: () => {
    instance.onmessage = (payload) => {
      const { event, ...data } = deserialize(payload.data);

      if (!ws.callbacks[event]) {
        console.log(`No callback for event: ${event}`);
        return;
      }

      ws.callbacks[event](data);
    };
  },

  send: <Data>(event: string, data: Data) => {
    if (!instance) {
      throw new Error("WebSocket is not connected");
    }

    instance.send(serialize(event, data));
  },

  on: (event: string, callback: <Data>(data: WebSocketData<Data>) => void) => {
    ws.callbacks[event] = callback;
  },
};
