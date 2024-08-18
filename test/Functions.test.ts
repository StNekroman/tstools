import { describe, expect, jest, test } from '@jest/globals';
import { Functions } from '../src/Functions';


describe("Functions", () => {
  test("identity", () => {
    expect(Functions.identity(1)()).toBe(1);
    expect(Functions.identity(undefined)()).toBe(undefined);
  });

  test("compose", () => {
    const fn : Functions.MapFunction<string, string> = Functions.compose((str) => {
      return str + "f1";
    }, (str) => {
      return str + "f2";
    })

    expect(fn("text")).toBe("textf1f2");
  });


  test("join", () => {
    const f1 = jest.fn();
    const f2 = jest.fn();
    const fn : Functions.Consumer<void> = Functions.join(f1, f2);

    fn();

    expect(f1).toBeCalledTimes(1);
    expect(f2).toBeCalledTimes(1);
  });

  test("memo", () => {
    const fn = jest.fn();
    const memoized = Functions.memo(fn);
    memoized();
    memoized();
    expect(fn).toBeCalledTimes(1);
  });

  test("memo with different params", () => {
    const fn = jest.fn((a: string, b: number) : boolean => true);;

    const memoized = Functions.memo(fn);
    memoized("str", 1);
    memoized("str", 1);
    memoized("str", 2);
    expect(fn).toBeCalledTimes(2);
  });

  test("memo with clear", () => {
    const fn = jest.fn((a: string, b: number) : boolean => true);;

    const memoized = Functions.memo(fn);
    memoized("str", 1);
    memoized("str", 1);
    expect(fn).toBeCalledTimes(1);
    memoized.clear();
    memoized("str", 1);
    memoized("str", 1);
    expect(fn).toBeCalledTimes(2); // +1 call
  });
});
