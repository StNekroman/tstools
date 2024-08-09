"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Throttle_1 = require("../src/Throttle");
(0, globals_1.describe)("Throttle", () => {
    (0, globals_1.test)("deferring", (done) => {
        const fn = globals_1.jest.fn();
        const deferred = Throttle_1.Throttle.deferring(fn, 1000);
        deferred();
        deferred();
        deferred();
        setTimeout(deferred, 500);
        setTimeout(() => {
            (0, globals_1.expect)(fn).toBeCalledTimes(0);
        }, 1001);
        setTimeout(() => {
            (0, globals_1.expect)(fn).toBeCalledTimes(0);
        }, 1200);
        (0, globals_1.expect)(fn).toBeCalledTimes(0);
        setTimeout(() => {
            (0, globals_1.expect)(fn).toBeCalledTimes(1);
            deferred.cancel();
            done();
        }, 1600);
    });
    (0, globals_1.test)("throttle", (done) => {
        const fn = globals_1.jest.fn();
        const throttled = Throttle_1.Throttle.throttle(fn, 1000);
        throttled();
        throttled();
        throttled();
        setTimeout(throttled, 500);
        (0, globals_1.expect)(fn).toBeCalledTimes(0);
        setTimeout(() => {
            (0, globals_1.expect)(fn).toBeCalledTimes(0);
        }, 600);
        setTimeout(() => {
            (0, globals_1.expect)(fn).toBeCalledTimes(1);
            throttled.cancel();
            done();
        }, 1200);
    });
});
