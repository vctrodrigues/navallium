import { DBService } from "./db";

import { SHIPS, TABLE_BOUNDS_Y, TABLE_BOUNDS_X } from "../const";
import { CellState } from "../enums/board";
import { UserRole } from "../enums/role";
import { RoomState } from "../enums/room";

import type { Room } from "../types/room";
import type { User } from "../types/user";
import type { MovePayload } from "../types/move";

export const roomService = (dbService: DBService<Room>) => ({
  create: (uid: string, user: User) => {
    const room: Room = {
      uid,
      turn: user.session,
      users: [
        {
          ...user,
          role: UserRole.Player,
          state: RoomState.Waiting,
        },
      ],

      moves: [],
    };

    dbService.save(room);

    return room;
  },

  join: (uid: string, user: User) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    if (
      room.users.filter((user) => user.role === UserRole.Player).length === 2
    ) {
      throw new Error("Room is full");
    }

    room.users.push({
      ...user,
      role: UserRole.Player,
      state: RoomState.Waiting,
    });

    dbService.update(room, { uid });

    return room;
  },

  move: (uid: string, move: MovePayload) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    // check if it's the user's turn
    const user = room.users.find((user) => user.session === move.session);

    const currentUserIndex = room.users.findIndex(
      (user) => user.session === room.turn
    );

    if (currentUserIndex === -1) {
      throw new Error("User not found");
    }

    if (user.session !== room.turn) {
      throw new Error("Not your turn");
    }

    // check if the move is valid
    if (move.x >= TABLE_BOUNDS_X || move.y >= TABLE_BOUNDS_Y) {
      throw new Error("Invalid move");
    }

    // get opponents board
    const opponent = room.users.find(
      (user) => user.session !== move.session && user.role === UserRole.Player
    );

    // uncovering cell
    if (SHIPS.includes(opponent.board.positions[move.y][move.x].state)) {
      opponent.board.positions[move.y][move.x] = {
        ...opponent.board.positions[move.y][move.x],
        hit: true,
      };
    } else {
      opponent.board.positions[move.y][move.x] = {
        ...opponent.board.positions[move.y][move.x],
        state: CellState.Miss,
      };
    }

    const hit = opponent.board.positions[move.y][move.x].hit;

    // switch turn
    room.turn = opponent.session;

    // save move into the room
    room.moves.push({
      ...move,
      hit,
    });

    // update room
    dbService.update(room, { uid });

    return room;
  },

  ready: (uid: string, user: User) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    const userIndex = room.users.findIndex(
      (_user) => _user.session === user.session
    );

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    room.users[userIndex].state = RoomState.Ready;
    room.users[userIndex].board = user.board;

    dbService.update(room, { uid });

    return room;
  },

  start: (uid: string) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    room.users.forEach((user) => {
      user.state = RoomState.Playing;
    });

    dbService.update(room, { uid });

    return room;
  },

  finish: (uid: string) => {
    const room = dbService.find({ uid });

    if (!room) {
      throw new Error("Room not found");
    }

    room.users.forEach((user) => {
      user.state = RoomState.Finished;
    });

    dbService.update(room, { uid });

    return room;
  },

  destroy: (uid: string) => {
    dbService.delete({ uid });
  },

  findByUserSession: (session: string) => {
    return dbService
      .findAll()
      .find((room) => room.users.some((user) => user.session === session));
  },
});
