import randomize from "randomatic";
import { User } from "../types/user";
import { DBService } from "./db";
import { CellState } from "../enums/board";

export const userService = (dbService: DBService<User>) => ({
  create(name: string, session: string) {
    if (!name) {
      throw new Error("Name is required");
    }

    if (!session) {
      throw new Error("Session is required");
    }

    let code = randomize("0", 6);

    while (dbService.find({ code })) {
      code = randomize("0", 6);
    }

    const user: User = {
      session,
      code,
      name,
      board: {
        positions: Array.from({ length: 10 }, () =>
          Array.from({ length: 10 }, () => ({
            index: -1,
            state: CellState.Empty,
          }))
        ),
      },
    };

    dbService.save(user);

    return user;
  },

  delete(code: string) {
    const user = dbService.find({ code });

    if (!user) {
      throw new Error("User not found");
    }

    dbService.delete({ code });

    return user;
  },

  get(code: string) {
    const user = dbService.find({ code });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});
