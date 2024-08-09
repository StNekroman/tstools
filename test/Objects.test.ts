import { describe, expect, jest, test } from '@jest/globals';
import { Objects } from '../src/Objects';
import { Types } from '../src/Types';


describe("Objects", () => {
  test("isObject", () => {
    expect(Objects.isObject(1)).toBe(false);
    expect(Objects.isObject(undefined)).toBe(false);
    expect(Objects.isObject(null)).toBe(false);
    expect(Objects.isObject(NaN)).toBe(false);
    expect(Objects.isObject("1")).toBe(false);
    expect(Objects.isObject({})).toBe(true);
    expect(Objects.isObject(new Date())).toBe(true);
  });

  test("isFunction", () => {
    expect(Objects.isFunction(undefined)).toBe(false);
    expect(Objects.isFunction(null)).toBe(false);
    expect(Objects.isFunction(NaN)).toBe(false);
    expect(Objects.isFunction(() => {})).toBe(true);
    expect(Objects.isFunction(function () {})).toBe(true);
    expect(Objects.isFunction(new Function())).toBe(true);
  });

  test("isArray", () => {
    expect(Objects.isArray(undefined)).toBe(false);
    expect(Objects.isArray(null)).toBe(false);
    expect(Objects.isArray(NaN)).toBe(false);
    expect(Objects.isArray(1)).toBe(false);
    expect(Objects.isArray("Array")).toBe(false);
    expect(Objects.isArray("[]")).toBe(false);
    expect(Objects.isArray([])).toBe(true);
    expect(Objects.isArray(new Array())).toBe(true);
  });

  test("isString", () => {
    expect(Objects.isString(undefined)).toBe(false);
    expect(Objects.isString(null)).toBe(false);
    expect(Objects.isString(NaN)).toBe(false);
    expect(Objects.isString(1)).toBe(false);
    expect(Objects.isString("Array")).toBe(true);
    expect(Objects.isString("[]")).toBe(true);
    expect(Objects.isString("")).toBe(true);
    expect(Objects.isString('')).toBe(true);
    expect(Objects.isString(``)).toBe(true);
    expect(Objects.isString({})).toBe(false);
  });

  test("isNotNullOrUndefined", () => {
    expect(Objects.isNotNullOrUndefined(undefined)).toBe(false);
    expect(Objects.isNotNullOrUndefined(null)).toBe(false);
    expect(Objects.isNotNullOrUndefined(NaN)).toBe(true);
    expect(Objects.isNotNullOrUndefined(1)).toBe(true);
    expect(Objects.isNotNullOrUndefined("Array")).toBe(true);
    expect(Objects.isNotNullOrUndefined("[]")).toBe(true);
    expect(Objects.isNotNullOrUndefined("")).toBe(true);
    expect(Objects.isNotNullOrUndefined({})).toBe(true);
  });

  test("isNumeric", () => {
    expect(Objects.isNumeric(undefined)).toBe(false);
    expect(Objects.isNumeric(null)).toBe(false);
    expect(Objects.isNumeric(NaN)).toBe(false);
    expect(Objects.isNumeric("Array")).toBe(false);
    expect(Objects.isNumeric("[]")).toBe(false);
    expect(Objects.isNumeric("")).toBe(false);
    expect(Objects.isNumeric({})).toBe(false);
    expect(Objects.isNumeric(1)).toBe(true);
    expect(Objects.isNumeric(BigInt("1"))).toBe(true);
  });

  test("isBoolean", () => {
    expect(Objects.isBoolean(undefined)).toBe(false);
    expect(Objects.isBoolean(null)).toBe(false);
    expect(Objects.isBoolean(NaN)).toBe(false);
    expect(Objects.isBoolean("true")).toBe(false);
    expect(Objects.isBoolean({})).toBe(false);
    expect(Objects.isBoolean("")).toBe(false);
    expect(Objects.isBoolean(true)).toBe(true);
    expect(Objects.isBoolean(false)).toBe(true);
  });

  test("isPrimitive", () => {
    expect(Objects.isPrimitive(undefined)).toBe(true);
    expect(Objects.isPrimitive(null)).toBe(true);
    expect(Objects.isPrimitive(NaN)).toBe(true);
    expect(Objects.isPrimitive(1)).toBe(true);
    expect(Objects.isPrimitive("1")).toBe(true);
    expect(Objects.isPrimitive("true")).toBe(true);
    expect(Objects.isPrimitive(new String("true"))).toBe(false);
    expect(Objects.isPrimitive(Number(1))).toBe(true);
    expect(Objects.isPrimitive(true)).toBe(true);
    
    expect(Objects.isPrimitive({})).toBe(false);
    expect(Objects.isPrimitive([])).toBe(false);
    expect(Objects.isPrimitive(() => {})).toBe(false);
    expect(Objects.isPrimitive(new Function())).toBe(false);
  });

  test("forEach", () => {
    const spy = jest.fn();
    const obj = {
      field1: spy,
      field2: spy,
      field3: spy
    };

    Objects.forEach(obj, (key, value) => {
      value();
    });

    expect(spy).toBeCalledTimes(3);
  });

  test("equals", () => {
    expect(Objects.equals({}, {})).toBe(true);
    expect(Objects.equals(1, 1)).toBe(true);
    expect(Objects.equals("1", "1")).toBe(true);
    expect(Objects.equals({a:1}, {a:1})).toBe(true);
    expect(Objects.equals({a:1}, {a:2})).toBe(false);
    expect(Objects.equals({a:1}, {a:1, b:1})).toBe(false);
    expect(Objects.equals({a:1, b:1}, {a:1, b:1})).toBe(true);
    expect(Objects.equals({a:1, b: {c:1}}, {a:1, b: {c:1}})).toBe(true);
    expect(Objects.equals({a:1, b: {c:1}}, {a:1, b: {c:2}})).toBe(false);
  });

  test("deepCopy", () => {
    const src = {
      a: 1,
      b: {
        c: 2
      }
    };
    const dst = Objects.deepCopy(src);
    expect(dst).toStrictEqual(src);
    expect(dst).not.toBe(src);
    expect(dst.b).not.toBe(src.b);
  });

  test("deepCopy with transfer", () => {
    const src = {
      a: 1,
      b: {
        c: 2
      },
      fn : () => {}
    };
    const dst = Objects.deepCopy(src, true);
    expect(dst).toStrictEqual(src);
    expect(dst).not.toBe(src);
    expect(dst.b).not.toBe(src.b);
    expect(dst.fn).toBe(src.fn);
  });

  test("extend without transfer", () => {
    const src = {
      a: 1,
      b: {
        c: 2
      },
      fn : () => {}
    };
    expect(() => Objects.deepCopy(src as Types.Serializable<typeof src>)).toThrow(Error);
  });

  test("extend", () => {
    let dst : Record<string, unknown> = {a: 1};
    Objects.extend(dst, {a: 1});
    expect(dst).toStrictEqual({a: 1});

    Objects.extend(dst, {a: 2});
    expect(Objects.equals(dst, {a: 2})).toBe(true);

    Objects.extend(dst, {b: 1});
    expect(Objects.equals(dst, {a: 2, b: 1})).toBe(true);

    Objects.extend(dst, {b: {c : 2}});
    expect(Objects.equals(dst, {a: 2, b: {c : 2}})).toBe(true);

    const fn = () => {};
    Objects.extend(dst, {b: fn});
    expect(dst.b).toBeDefined();
    expect(Objects.isFunction(dst.b)).toBe(true);
    expect(dst.b).toBe(fn);
  });

   test("isCharacterWhitespace", () => {
    expect(Objects.isCharacterWhitespace('s')).toBe(false);
    expect(Objects.isCharacterWhitespace(' ')).toBe(true);
    expect(Objects.isCharacterWhitespace(undefined!)).toBe(false);
    expect(Objects.isCharacterWhitespace("  ")).toBe(false);
   });

   test("isBlankString", () => {
    expect(Objects.isBlankString("")).toBe(true);
    expect(Objects.isBlankString(" ")).toBe(true);
    expect(Objects.isBlankString("  ")).toBe(true);
    expect(Objects.isBlankString("  \t  ")).toBe(true);
    expect(Objects.isBlankString("  \t  \r\n")).toBe(true);
    expect(Objects.isBlankString("g")).toBe(false);
   });
});
