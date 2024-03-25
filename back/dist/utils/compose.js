"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
const compose = (...callbacks) => {
    callbacks.forEach((callback) => {
        if (typeof callback !== "function") {
            throw new Error("Callback is not a function");
        }
        callback();
    });
};
exports.compose = compose;
//# sourceMappingURL=compose.js.map