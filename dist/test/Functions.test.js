"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Functions_1 = require("../src/Functions");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("Functions", () => {
    (0, globals_1.test)("identity", () => {
        (0, globals_1.expect)(Functions_1.Functions.identity(1)()).toBe(1);
        (0, globals_1.expect)(Functions_1.Functions.identity(undefined)()).toBe(undefined);
    });
    (0, globals_1.test)("compose", () => {
        const fn = Functions_1.Functions.compose((str) => {
            return str + "f1";
        }, (str) => {
            return str + "f2";
        });
        (0, globals_1.expect)(fn("text")).toBe("textf1f2");
    });
    (0, globals_1.test)("join", () => {
        const f1 = globals_1.jest.fn();
        const f2 = globals_1.jest.fn();
        const fn = Functions_1.Functions.join(f1, f2);
        fn();
        (0, globals_1.expect)(f1).toBeCalledTimes(1);
        (0, globals_1.expect)(f2).toBeCalledTimes(1);
    });
});
