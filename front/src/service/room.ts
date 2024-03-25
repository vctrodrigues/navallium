import { ws } from "./ws";

import { RoomEvents } from "@/enums/event";

import type { MovePayload } from "@/types/move";
import type { WebSocketData } from "@/types/ws";
import type { Room, Invite } from "@/types/room";
import type { User } from "@/types/user";

interface RoomServiceConfig {
  setRoom: (room?: Room) => void;
  setInvite: (invite?: Invite) => void;
  setResult: (newResult: { winner: string; loser: string }) => void;
}

export const roomService = {
  create: (user: User, invite: string) => {
    ws.send(RoomEvents.Create, { user, invite });
  },

  join: (uid: string, user: User) => {
    ws.send(RoomEvents.Join, { uid, user });
  },

  deny: (room: Room) => {
    ws.send(RoomEvents.Answer, { room, accepted: false });
  },

  ready: (room: Room, user: User) => {
    ws.send(RoomEvents.Ready, { uid: room.uid, user });
  },

  move: (room: Room, move: MovePayload) => {
    ws.send(RoomEvents.Move, { uid: room.uid, move });
  },

  initialize: (config: RoomServiceConfig) => {
    const setRoom = <Data = Room>(data: WebSocketData<Data>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      config.setRoom(data.data as Room);
    };

    const setInvite = <Data = Invite>(data: WebSocketData<Data>) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      config.setInvite(data.data as Invite);
    };

    const setAccepted = <Data = boolean>(data: WebSocketData<Data>) => {
      if (!data.success) {
        config.setRoom(undefined);
        return;
      }

      config.setRoom(data.data as Room);
    };

    const finish = <Data = { room: Room; winner: string; loser: string }>(
      data: WebSocketData<Data>
    ) => {
      if (!data.success) {
        console.error(data.error);
        return;
      }

      const { room, winner, loser } = data.data as {
        room: Room;
        winner: string;
        loser: string;
      };

      config.setRoom(room);
      config.setResult({ winner, loser });
    };

    ws.on(RoomEvents.Answer, setAccepted);

    ws.on(RoomEvents.Create, setRoom);
    ws.on(RoomEvents.Join, setRoom);
    ws.on(RoomEvents.Move, setRoom);
    ws.on(RoomEvents.Ready, setRoom);
    ws.on(RoomEvents.Start, setRoom);

    ws.on(RoomEvents.Finish, finish);

    ws.on(RoomEvents.Invite, setInvite);
  },
};
