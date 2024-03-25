"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const dbService = (idKey, initialValue) => {
    let value = initialValue !== null && initialValue !== void 0 ? initialValue : [];
    return {
        findAll(options) {
            if (options === null || options === void 0 ? void 0 : options.cursor) {
                const cursorIndex = value.findIndex((item) => item[idKey] === options.cursor);
                value = value.slice(cursorIndex + 1);
            }
            return value;
        },
        find(where) {
            return value.find((item) => {
                return Object.keys(where).every((key) => {
                    return item[key] === where[key];
                });
            });
        },
        update(newValue, where) {
            let updated;
            value = value.map((item) => {
                if (Object.keys(where).every((key) => item[key] === where[key])) {
                    updated = newValue;
                    return newValue;
                }
                return item;
            });
            return updated;
        },
        delete(where) {
            let deleted;
            value = value.filter((item) => {
                if (Object.keys(where).every((key) => item[key] === where[key])) {
                    deleted = item;
                    return false;
                }
                return true;
            });
            return deleted;
        },
        save(newValue) {
            value.push(newValue);
            return newValue;
        },
    };
};
exports.dbService = dbService;
//# sourceMappingURL=db.js.map