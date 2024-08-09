"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Throttle = void 0;
var Throttle;
(function (Throttle) {
    function throttle(callback, timeout) {
        let lastArgs;
        let timerId;
        const throttleFunction = (...args) => {
            lastArgs = args;
            if (timerId === undefined) {
                timerId = setTimeout(() => {
                    callback(lastArgs);
                    lastArgs = undefined;
                    timerId = undefined;
                }, timeout);
            }
        };
        throttleFunction.cancel = () => {
            if (timerId !== undefined) {
                clearTimeout(timerId);
                timerId = undefined;
            }
            lastArgs = undefined;
        };
        return throttleFunction;
    }
    Throttle.throttle = throttle;
    function deferring(callback, timeout) {
        let lastArgs;
        let timerId;
        const throttleFunction = (...args) => {
            lastArgs = args;
            if (timerId !== undefined) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                callback(lastArgs);
                lastArgs = undefined;
                timerId = undefined;
            }, timeout);
        };
        throttleFunction.cancel = () => {
            if (timerId !== undefined) {
                clearTimeout(timerId);
                timerId = undefined;
            }
            lastArgs = undefined;
        };
        return throttleFunction;
    }
    Throttle.deferring = deferring;
})(Throttle || (exports.Throttle = Throttle = {}));
