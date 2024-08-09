"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Arrays_1 = require("../src/Arrays");
(0, globals_1.describe)("Arrays", () => {
    (0, globals_1.test)("deleteItem", () => {
        let arr = [1, 2, 3];
        (0, globals_1.expect)(Arrays_1.Arrays.deleteItem(arr, 3)).toBe(true);
        (0, globals_1.expect)(arr).toStrictEqual([1, 2]);
        arr = [1, 2, 3];
        (0, globals_1.expect)(Arrays_1.Arrays.deleteItem(arr, 5)).toBe(false);
        (0, globals_1.expect)(arr).toStrictEqual([1, 2, 3]);
    });
    (0, globals_1.test)("pushAll", () => {
        (0, globals_1.expect)(Arrays_1.Arrays.pushAll([], [2, 3])).toStrictEqual([2, 3]);
        (0, globals_1.expect)(Arrays_1.Arrays.pushAll([1], [2, 3])).toStrictEqual([1, 2, 3]);
        (0, globals_1.expect)(Arrays_1.Arrays.pushAll([1], [1, 2, 3])).toStrictEqual([1, 1, 2, 3]);
        (0, globals_1.expect)(Arrays_1.Arrays.pushAll([1], [])).toStrictEqual([1]);
    });
    (0, globals_1.test)("shuffle", () => {
        const shuffled = Arrays_1.Arrays.shuffle([1, 2, 3]);
        (0, globals_1.expect)(shuffled).toBeDefined();
        (0, globals_1.expect)(shuffled).not.toStrictEqual([1, 2, 3]);
    });
});
