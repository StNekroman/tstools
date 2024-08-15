
import { describe, expect, jest, test } from '@jest/globals';
import { Throttle } from '../src/Throttle';

describe("Throttle", () => {
  test("deferring", (done) => {
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

  test("throttle", (done) => {
    const fn = jest.fn();
    const throttled = Throttle.throttle(fn, 200);
    throttled();
    throttled();
    throttled();
    setTimeout(throttled, 100);

    expect(fn).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn).toBeCalledTimes(0);
    }, 150);
  
    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      throttled.cancel();
      done();
    }, 300);
  });
});