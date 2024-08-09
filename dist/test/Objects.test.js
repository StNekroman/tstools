"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const Objects_1 = require("../src/Objects");
(0, globals_1.describe)("Objects", () => {
    (0, globals_1.test)("isObject", () => {
        (0, globals_1.expect)(Objects_1.Objects.isObject(1)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isObject(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isObject(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isObject(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isObject("1")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isObject({})).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isObject(new Date())).toBe(true);
    });
    (0, globals_1.test)("isFunction", () => {
        (0, globals_1.expect)(Objects_1.Objects.isFunction(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isFunction(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isFunction(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isFunction(() => { })).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isFunction(function () { })).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isFunction(new Function())).toBe(true);
    });
    (0, globals_1.test)("isArray", () => {
        (0, globals_1.expect)(Objects_1.Objects.isArray(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray(1)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray("Array")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray("[]")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isArray([])).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isArray(new Array())).toBe(true);
    });
    (0, globals_1.test)("isString", () => {
        (0, globals_1.expect)(Objects_1.Objects.isString(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isString(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isString(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isString(1)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isString("Array")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isString("[]")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isString("")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isString('')).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isString(``)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isString({})).toBe(false);
    });
    (0, globals_1.test)("isNotNullOrUndefined", () => {
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined(NaN)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined(1)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined("Array")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined("[]")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined("")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNotNullOrUndefined({})).toBe(true);
    });
    (0, globals_1.test)("isNumeric", () => {
        (0, globals_1.expect)(Objects_1.Objects.isNumeric(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric("Array")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric("[]")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric("")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric({})).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric(1)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isNumeric(BigInt("1"))).toBe(true);
    });
    (0, globals_1.test)("isBoolean", () => {
        (0, globals_1.expect)(Objects_1.Objects.isBoolean(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean(null)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean(NaN)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean("true")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean({})).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean("")).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean(true)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBoolean(false)).toBe(true);
    });
    (0, globals_1.test)("isPrimitive", () => {
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(undefined)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(null)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(NaN)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(1)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive("1")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive("true")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(new String("true"))).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(Number(1))).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(true)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive({})).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive([])).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(() => { })).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isPrimitive(new Function())).toBe(false);
    });
    (0, globals_1.test)("forEach", () => {
        const spy = globals_1.jest.fn();
        const obj = {
            field1: spy,
            field2: spy,
            field3: spy
        };
        Objects_1.Objects.forEach(obj, (key, value) => {
            value();
        });
        (0, globals_1.expect)(spy).toBeCalledTimes(3);
    });
    (0, globals_1.test)("equals", () => {
        (0, globals_1.expect)(Objects_1.Objects.equals({}, {})).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals(1, 1)).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals("1", "1")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1 }, { a: 1 })).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1 }, { a: 2 })).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1 }, { a: 1, b: 1 })).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1, b: { c: 1 } }, { a: 1, b: { c: 1 } })).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.equals({ a: 1, b: { c: 1 } }, { a: 1, b: { c: 2 } })).toBe(false);
    });
    (0, globals_1.test)("deepCopy", () => {
        const src = {
            a: 1,
            b: {
                c: 2
            }
        };
        const dst = Objects_1.Objects.deepCopy(src);
        (0, globals_1.expect)(dst).toStrictEqual(src);
        (0, globals_1.expect)(dst).not.toBe(src);
        (0, globals_1.expect)(dst.b).not.toBe(src.b);
    });
    (0, globals_1.test)("deepCopy with transfer", () => {
        const src = {
            a: 1,
            b: {
                c: 2
            },
            fn: () => { }
        };
        const dst = Objects_1.Objects.deepCopy(src, true);
        (0, globals_1.expect)(dst).toStrictEqual(src);
        (0, globals_1.expect)(dst).not.toBe(src);
        (0, globals_1.expect)(dst.b).not.toBe(src.b);
        (0, globals_1.expect)(dst.fn).toBe(src.fn);
    });
    (0, globals_1.test)("extend without transfer", () => {
        const src = {
            a: 1,
            b: {
                c: 2
            },
            fn: () => { }
        };
        (0, globals_1.expect)(() => Objects_1.Objects.deepCopy(src)).toThrow(Error);
    });
    (0, globals_1.test)("extend", () => {
        let dst = { a: 1 };
        Objects_1.Objects.extend(dst, { a: 1 });
        (0, globals_1.expect)(dst).toStrictEqual({ a: 1 });
        Objects_1.Objects.extend(dst, { a: 2 });
        (0, globals_1.expect)(Objects_1.Objects.equals(dst, { a: 2 })).toBe(true);
        Objects_1.Objects.extend(dst, { b: 1 });
        (0, globals_1.expect)(Objects_1.Objects.equals(dst, { a: 2, b: 1 })).toBe(true);
        Objects_1.Objects.extend(dst, { b: { c: 2 } });
        (0, globals_1.expect)(Objects_1.Objects.equals(dst, { a: 2, b: { c: 2 } })).toBe(true);
        const fn = () => { };
        Objects_1.Objects.extend(dst, { b: fn });
        (0, globals_1.expect)(dst.b).toBeDefined();
        (0, globals_1.expect)(Objects_1.Objects.isFunction(dst.b)).toBe(true);
        (0, globals_1.expect)(dst.b).toBe(fn);
    });
    (0, globals_1.test)("isCharacterWhitespace", () => {
        (0, globals_1.expect)(Objects_1.Objects.isCharacterWhitespace('s')).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isCharacterWhitespace(' ')).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isCharacterWhitespace(undefined)).toBe(false);
        (0, globals_1.expect)(Objects_1.Objects.isCharacterWhitespace("  ")).toBe(false);
    });
    (0, globals_1.test)("isBlankString", () => {
        (0, globals_1.expect)(Objects_1.Objects.isBlankString("")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBlankString(" ")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBlankString("  ")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBlankString("  \t  ")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBlankString("  \t  \r\n")).toBe(true);
        (0, globals_1.expect)(Objects_1.Objects.isBlankString("g")).toBe(false);
    });
});
