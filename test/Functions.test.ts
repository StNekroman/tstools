import { describe, expect, jest, test } from '@jest/globals';
import { Functions } from '../src/Functions';


describe("Functions", () => {
  test("identity", () => {
    expect(Functions.identity(1)()).toBe(1);
    expect(Functions.identity(undefined)()).toBe(undefined);
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

  test("pipe numbers", () => {
    const piped = Functions.pipe((a: number) => a * 2)
      .pipe((a: number) => a * 3)
      .pipe((a: number) => a - 4);

    expect(piped(1)).toBe(2);
    expect(piped(2)).toBe(8);
  });

type Pipe<T extends any[]> = T extends [(arg: infer A) => infer B, ...infer R]
  ? Pipe<R>
  : T;

  type PipeFn<T extends any[]> = T extends [infer F extends (...args: any[]) => any, ...infer Rest]
  ? (...args: Parameters<F>) => PipeFn<Rest extends any[] ? Rest : []>
  : (...args: any[]) => any;

  test("pipe mix", () => {
    const piped = Functions.pipe((a: number) => a + 1)
      .pipe((a: number) => a % 2 === 0 ? true : false)
      .pipe((flag: boolean) => flag ? "textTrue" : "textFalse");

    expect(piped(1)).toBe("textTrue");
    expect(piped(2)).toBe("textFalse");
  });

  test("pipe array chain", () => {
    const piped = Functions.pipe(
      (a: number) => a + 1,
      (a: number) => a % 2 === 0 ? true : false
    )
    .pipe((flag: boolean) => flag ? "textTrue" : "textFalse");

    expect(piped(1)).toBe("textTrue");
    expect(piped(2)).toBe("textFalse");
  });
});
