import { describe, expect, jest, test } from '@jest/globals';
import { Throttle } from '../src/throttle/Throttle';

describe('Throttle', () => {
  test('deferring', (done) => {
    const fn = jest.fn();
    const deferred = Throttle.deferring(fn, 200);
    deferred();
    deferred();
    deferred();
    setTimeout(deferred, 100);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 300);

    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      deferred.cancel();
      done();
    }, 400);
  });

  test('throttle', (done) => {
    const fn = jest.fn((_a: number, _b: string) => {});
    const throttled = Throttle.debounce(fn, 200);
    throttled(1, 'str');
    throttled(1, 'str');
    throttled(2, 'str2');
    setTimeout(() => throttled(3, 'str3'), 100);

    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 150);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      expect(fn).toBeCalledWith(3, 'str3');
      throttled.cancel();
      done();
    }, 300);
  });
});
