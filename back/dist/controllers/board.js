"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boardController = void 0;
const board_1 = require("../service/board");
const serialize_1 = require("../utils/serialize");
const boardController = (ws, dbService) => {
    const _boardService = (0, board_1.boardService)(dbService);
    return {
        update: (userCode, board) => {
            console.log(`> Adding ship to user: ${userCode}`);
            try {
                const user = _boardService.update(userCode, board);
                console.log(`> Board updated [${user.name}]`);
                ws.send((0, serialize_1.serialize)(user));
            }
            catch (error) {
                console.log(`> Error adding ship to user: ${userCode}`);
                ws.send((0, serialize_1.serialize)({ error: error.message }, false));
            }
        },
        uncoverCell: (userCode, x, y) => {
            console.log(`> Uncovering cell for user: ${userCode}`);
            try {
                const state = _boardService.uncoverCell(userCode, x, y);
                console.log(`> Cell [${x}, ${y}] uncovered for [${userCode}]. It's [${state}]`);
                ws.send((0, serialize_1.serialize)(state));
            }
            catch (error) {
                console.log(`> Error uncovering cell for user: ${userCode}`);
                ws.send((0, serialize_1.serialize)({ error: error.message }, false));
            }
        },
    };
};
exports.boardController = boardController;
//# sourceMappingURL=board.js.map