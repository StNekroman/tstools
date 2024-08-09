
import { describe, expect, jest, test } from '@jest/globals';
import { Throttle } from '../src/Throttle';

describe("Throttle", () => {
  test("deferring", (done) => {
    const fn = jest.fn();
    const deferred = Throttle.deferring(fn, 1000);
    deferred();
    deferred();
    deferred();
    setTimeout(deferred, 500);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 1001);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 1200);

    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
        expect(fn).toBeCalledTimes(1);
        deferred.cancel();
        done();
    }, 1600);
  });

  test("throttle", (done) => {
    const fn = jest.fn();
    const throttled = Throttle.throttle(fn, 1000);
    throttled();
    throttled();
    throttled();
    setTimeout(throttled, 500);

    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 600);
  
    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      throttled.cancel();
      done();
    }, 1200);
  });
});