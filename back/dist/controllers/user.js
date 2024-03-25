"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_1 = require("../service/user");
const serialize_1 = require("../utils/serialize");
const userController = (ws, dbService) => {
    const _userService = (0, user_1.userService)(dbService);
    return {
        create: (name, session) => {
            console.log(`> Creating user: ${name}`);
            try {
                const user = _userService.create(name, session);
                console.log(`> User created: ${user.name}`);
                ws.send((0, serialize_1.serialize)(user));
            }
            catch (error) {
                console.log(`> Error creating user: ${name}`);
                ws.send((0, serialize_1.serialize)({ error: error.message }, false));
            }
        },
        delete: (code) => {
            console.log(`> Removing user: ${code}`);
            try {
                const user = _userService.delete(code);
                console.log(`> User removed: ${user.name}`);
                ws.send((0, serialize_1.serialize)(user));
            }
            catch (error) {
                console.log(`> Error removing user: ${code}`);
                ws.send((0, serialize_1.serialize)({ error: error.message }, false));
            }
        },
        deleteBySession: (session) => {
            console.log(`> Removing user by session: ${session}`);
            try {
                const user = dbService.delete({ session });
                console.log(`> User removed: ${user === null || user === void 0 ? void 0 : user.name}`);
                ws.send((0, serialize_1.serialize)(user));
            }
            catch (error) {
                console.log(`> Error removing user by session: ${session}`);
                ws.send((0, serialize_1.serialize)({ error: error.message }, false));
            }
        },
    };
};
exports.userController = userController;
//# sourceMappingURL=user.js.map