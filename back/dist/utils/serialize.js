"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = void 0;
const serialize = (data, success = true) => {
    return JSON.stringify({ success, data });
};
exports.serialize = serialize;
const deserialize = (data) => {
    return JSON.parse(data);
};
exports.deserialize = deserialize;
//# sourceMappingURL=serialize.js.map