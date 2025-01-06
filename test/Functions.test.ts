import { describe, expect, jest, test } from '@jest/globals';
import { Functions } from '../src/Functions';

describe('Functions', () => {
  test('identity', () => {
    expect(Functions.identity(1)()).toBe(1);
    expect(Functions.identity(undefined)()).toBe(undefined);
  });

  test('join', () => {
    const f1 = jest.fn();
    const f2 = jest.fn();
    const fn: Functions.Consumer<void> = Functions.join(f1, f2);

    fn();

    expect(f1).toBeCalledTimes(1);
    expect(f2).toBeCalledTimes(1);
  });

  test('memo', () => {
    const fn = jest.fn();
    const memoized = Functions.memo(fn);
    memoized();
    memoized();
    expect(fn).toBeCalledTimes(1);
  });

  test('memo with different params', () => {
    const fn = jest.fn((a: string, b: number): boolean => true);

    const memoized = Functions.memo(fn);
    memoized('str', 1);
    memoized('str', 1);
    memoized('str', 2);
    expect(fn).toBeCalledTimes(2);
  });

  test('memo with clear', () => {
    const fn = jest.fn((a: string, b: number): boolean => true);

    const memoized = Functions.memo(fn);
    memoized('str', 1);
    memoized('str', 1);
    expect(fn).toBeCalledTimes(1);
    memoized.clear();
    memoized('str', 1);
    memoized('str', 1);
    expect(fn).toBeCalledTimes(2); // +1 call
  });

  test('pipe numbers', () => {
    const piped = Functions.pipe((a: number) => a * 2)
      .pipe((a: number) => a * 3)
      .pipe((a: number) => a - 4);

    expect(piped(1)).toBe(2);
    expect(piped(2)).toBe(8);
  });

  test('pipe mix', () => {
    const piped = Functions.pipe((a: number) => a + 1)
      .pipe((a: number) => (a % 2 === 0 ? true : false))
      .pipe((flag: boolean) => (flag ? 'textTrue' : 'textFalse'));

    expect(piped(1)).toBe('textTrue');
    expect(piped(2)).toBe('textFalse');
  });

  test('pipe array chain', () => {
    const piped = Functions.pipe(
      (a: number) => a + 1,
      (a: number) => (a % 2 === 0 ? true : false)
    ).pipe((flag: boolean) => (flag ? 'textTrue' : 'textFalse'));

    expect(piped(1)).toBe('textTrue');
    expect(piped(2)).toBe('textFalse');
  });

  test('retry', () => {
    const working = jest.fn(() => 'working');
    const failsAlways = jest.fn(() => {
      throw new Error('failed');
    });
    const failsFirstTime = jest.fn(() => {
      if (failsFirstTime.mock.calls.length === 1) {
        throw new Error('failed');
      } else {
        return 'working';
      }
    });

    expect(Functions.retry(working)).toBe('working');
    expect(() => Functions.retry(failsAlways)).toThrowError('failed');
    expect(Functions.retry(failsFirstTime)).toBe('working');
    expect(failsFirstTime).toBeCalledTimes(2);
  });
});
