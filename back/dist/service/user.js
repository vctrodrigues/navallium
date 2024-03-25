"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const randomatic_1 = __importDefault(require("randomatic"));
const board_1 = require("../types/board");
const userService = (dbService) => ({
    create(name, session) {
        if (!name) {
            throw new Error("Name is required");
        }
        if (!session) {
            throw new Error("Session is required");
        }
        const code = (0, randomatic_1.default)("0", 6);
        const user = {
            session,
            code,
            name,
            board: {
                positions: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => board_1.Cell.Empty)),
            },
        };
        dbService.save(user);
        return user;
    },
    delete(code) {
        const user = dbService.find({ code });
        if (!user) {
            throw new Error("User not found");
        }
        dbService.delete({ code });
        return user;
    },
});
exports.userService = userService;
//# sourceMappingURL=user.js.map