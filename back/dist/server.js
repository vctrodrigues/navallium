"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const user_1 = require("./controllers/user");
const app_1 = require("./controllers/app");
const db_1 = require("./service/db");
const compose_1 = require("./utils/compose");
const board_1 = require("./controllers/board");
const serialize_1 = require("./utils/serialize");
const wss = new ws_1.WebSocketServer({ port: 8080 });
console.log("> Server started");
const userDB = (0, db_1.dbService)("code");
console.log("> User DB initialized");
wss.on("connection", (ws, req) => {
    var _a, _b;
    console.log("> New client connected");
    const url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "");
    const session = (_b = url.searchParams.get("session")) !== null && _b !== void 0 ? _b : "";
    const _appController = (0, app_1.appController)(ws);
    const _userController = (0, user_1.userController)(ws, userDB);
    const _boardController = (0, board_1.boardController)(ws, userDB);
    ws.on("user:create", (name) => _userController.create(name, session));
    ws.on("user:delete", _userController.delete);
    ws.on("board:uncover", _boardController.uncoverCell);
    ws.on("board:update", (userCode, board) => _boardController.update(userCode, (0, serialize_1.deserialize)(board)));
    ws.on("close", () => (0, compose_1.compose)(() => _userController.deleteBySession(session), _appController.close));
});
//# sourceMappingURL=server.js.map