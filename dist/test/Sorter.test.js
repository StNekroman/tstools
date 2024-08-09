"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Sorter_1 = require("../src/Sorter");
const src_1 = require("../src");
const data = [
    { a: 1, b: 1, c: 1 },
    { a: 2, b: 1, c: 1 },
    { a: 3, b: 1, c: 1 },
    { a: 3, b: 2, c: 1 },
    { a: 3, b: 3, c: 1 }
];
(0, globals_1.describe)("Sorter", () => {
    (0, globals_1.test)("sorting", () => {
        const arr = src_1.Arrays.shuffle([...data]);
        arr.sort(Sorter_1.Sorter.byField("a").build(Sorter_1.Sorter.byField("b").inverse().build()));
        (0, globals_1.expect)(arr).toStrictEqual([
            { a: 1, b: 1, c: 1 },
            { a: 2, b: 1, c: 1 },
            { a: 3, b: 3, c: 1 },
            { a: 3, b: 2, c: 1 },
            { a: 3, b: 1, c: 1 }
        ]);
    });
});
