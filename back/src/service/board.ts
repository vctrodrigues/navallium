import { DBService } from "./db";

import type { User } from "../types/user";
import type { Board } from "../types/board";

export const boardService = (dbService: DBService<User>) => ({
  update: (userCode: string, board: Board) => {
    const user = dbService.find({
      code: userCode,
    });

    if (!user) {
      throw new Error("User not found");
    }

    user.board = board;

    dbService.update(user, { code: user.code });

    return user;
  },
});
