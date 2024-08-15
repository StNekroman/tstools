
import { describe, expect, jest, test } from '@jest/globals';
import { Deffered } from '../src/Deffered';

describe("Deffered", () => {
  test("deferring void", (done) => {
    const fn = jest.fn();
    const deferred = new Deffered();
    deferred.promise.then(fn);
    expect(fn).toBeCalledTimes(0);

    deferred.resolve();

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      done();
    });
  });

  test("deferring string", (done) => {
    const fn = jest.fn();
    const deferred = new Deffered<string>();
    deferred.promise.then(fn);
    expect(fn).toBeCalledTimes(0);

    deferred.resolve("str");

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      done();
    });
  });

});