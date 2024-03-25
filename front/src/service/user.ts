import { ws } from "./ws";
import { UserEvents } from "@/enums/event";
import type { User } from "@/types/user";
import type { WebSocketData } from "@/types/ws";

interface UserServiceConfig {
  setUser: (user?: User) => void;
}

export const userService = {
  create: (name: string) => {
    ws.send(UserEvents.Create, { name });
  },

  delete: (code: string) => {
    ws.send(UserEvents.Delete, { code });
  },

  initialize: (config: UserServiceConfig) => {
    const createUser = <Data = User>(data: WebSocketData<Data>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      config.setUser(data.data as User);
    };

    const retrieveUser = <Data = User>(data: WebSocketData<Data>) => {
      if (!data.success) {
        console.error(data.error);
        config.setUser(undefined);
        return;
      }

      config.setUser(data.data as User);
    };

    ws.on(UserEvents.Get, retrieveUser);

    ws.on(UserEvents.Create, createUser);
  },
};
