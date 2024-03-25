import { SHIPS } from "../const";
import { CellState } from "../enums/board";
import type { Room } from "../types/room";

export const hideBoard = (session: string, room: Room) => {
  const _room = JSON.parse(JSON.stringify(room)) as Room;

  _room.users = _room.users.map((user) => {
    if (user.session === session) {
      return user;
    }

    user.board.positions = user.board.positions.map((row) => {
      return row.map((cell) => {
        return SHIPS.includes(cell.state)
          ? { index: -1, state: CellState.Empty, hit: cell.hit }
          : cell;
      });
    });

    return user;
  });

  return _room;
};
