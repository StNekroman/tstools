"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Objects = void 0;
var Objects;
(function (Objects) {
    function isNotNullOrUndefined(arg) {
        return arg !== null && arg !== undefined;
    }
    Objects.isNotNullOrUndefined = isNotNullOrUndefined;
    function isObject(arg) {
        return typeof arg === "object" && arg !== null;
    }
    Objects.isObject = isObject;
    function isFunction(arg) {
        return typeof arg === "function";
    }
    Objects.isFunction = isFunction;
    function isArray(arg) {
        return Array.isArray(arg) || (arg instanceof Array);
    }
    Objects.isArray = isArray;
    function isString(arg) {
        return typeof arg === "string";
    }
    Objects.isString = isString;
    function isNumeric(arg) {
        if (!Objects.isNotNullOrUndefined(arg)) {
            return false;
        }
        return typeof arg === "bigint" || typeof arg === "number" && !isNaN(arg);
    }
    Objects.isNumeric = isNumeric;
    function isBoolean(arg) {
        return typeof arg === "boolean";
    }
    Objects.isBoolean = isBoolean;
    function isPrimitive(arg) {
        if (!Objects.isNotNullOrUndefined(arg)) {
            return true;
        }
        if (Objects.isObject(arg) || Objects.isFunction(arg)) {
            return false;
        }
        else {
            return true;
        }
    }
    Objects.isPrimitive = isPrimitive;
    function forEach(obj, callback) {
        for (const key of Object.keys(obj)) {
            callback(key, obj[key]);
        }
    }
    Objects.forEach = forEach;
    function equals(obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        }
        else if (obj1 && obj2 && Objects.isObject(obj1) && Objects.isObject(obj2)) {
            const keys1 = Object.keys(obj1);
            const keys2 = new Set(Object.keys(obj2));
            for (const key of keys1) {
                if (!Objects.equals(obj1[key], obj2[key])) {
                    return false;
                }
                keys2.delete(key);
            }
            return keys2.size === 0;
        }
        else {
            return false;
        }
    }
    Objects.equals = equals;
    function deepCopy(obj, transferNotCopyable) {
        if (Objects.isPrimitive(obj)) {
            return obj;
        }
        if (obj instanceof Date) {
            const date = new Date();
            date.setTime(obj.getTime());
            return date;
        }
        if (Array.isArray(obj)) {
            return obj.map((item) => deepCopy(item, transferNotCopyable));
        }
        if (Objects.isObject(obj)) {
            const copy = {};
            Objects.forEach(obj, (key, value) => {
                copy[key] = Objects.deepCopy(value, transferNotCopyable);
            });
            return copy;
        }
        if (transferNotCopyable) {
            return obj;
        }
        else {
            throw new Error("Cannot clone not-copyable fields (methods inside?) during Objects.deepCopy.");
        }
    }
    Objects.deepCopy = deepCopy;
    function extend(dst, src) {
        if (Objects.isNotNullOrUndefined(src)) {
            Objects.forEach(src, (key, value) => {
                if (Objects.isObject(value) && Objects.isObject(dst[key])) {
                    Objects.extend(dst[key], value);
                }
                else {
                    dst[key] = Objects.deepCopy(value, true);
                }
            });
        }
        return dst;
    }
    Objects.extend = extend;
    function isCharacterWhitespace(c) {
        return c === " "
            || c === "\n"
            || c === "\t"
            || c === "\r"
            || c === "\f"
            || c === "\v"
            || c === "\u00a0"
            || c === "\u1680"
            || c === "\u2000"
            || c === "\u200a"
            || c === "\u2028"
            || c === "\u2029"
            || c === "\u202f"
            || c === "\u205f"
            || c === "\u3000"
            || c === "\ufeff";
    }
    Objects.isCharacterWhitespace = isCharacterWhitespace;
    function isBlankString(str) {
        if (Objects.isNotNullOrUndefined(str)) {
            for (const ch of str) {
                if (!Objects.isCharacterWhitespace(ch)) {
                    return false;
                }
            }
        }
        return true;
    }
    Objects.isBlankString = isBlankString;
})(Objects || (exports.Objects = Objects = {}));
