"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardService = void 0;
const board_1 = require("../types/board");
const boardService = (dbService) => ({
    update: (userCode, board) => {
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
    uncoverCell: (userCode, x, y) => {
        const user = dbService.find({
            code: userCode,
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.board.positions[y][x] === board_1.Cell.Ship) {
            user.board.positions[y][x] = board_1.Cell.Hit;
        }
        else {
            user.board.positions[y][x] = board_1.Cell.Miss;
        }
        const state = user.board.positions[y][x];
        dbService.update(user, { code: user.code });
        return state;
    },
});
exports.boardService = boardService;
//# sourceMappingURL=board.js.map