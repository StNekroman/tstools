"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
var Functions;
(function (Functions) {
    function noop(..._args) { }
    Functions.noop = noop;
    function identity(arg) {
        return () => arg;
    }
    Functions.identity = identity;
    function compose(before, after) {
        return (input) => {
            return after(before(input));
        };
    }
    Functions.compose = compose;
    function join(...functions) {
        return (...args) => {
            for (const func of functions) {
                func(...args);
            }
        };
    }
    Functions.join = join;
    function extractor(field) {
        return (obj) => {
            return obj[field];
        };
    }
    Functions.extractor = extractor;
})(Functions || (exports.Functions = Functions = {}));
