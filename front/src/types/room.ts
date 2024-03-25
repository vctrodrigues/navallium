import type { RoomState } from "@/enums/room";
import type { Move } from "./move";
import type { User } from "./user";

type UserConfig = {
  role: "player" | "spectator";
  state: RoomState;
} & User;

export type Room = {
  uid: string;
  turn: User["session"];
  users: UserConfig[];
  moves: Move[];
  winner?: User["session"];
};

export type Invite = {
  room: Room;
  host: string;
};
