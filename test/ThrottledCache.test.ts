
import { describe, expect, jest, test } from '@jest/globals';
import { SimpleThrottledCache } from '../examples/throttledCache/SimpleThrottledCache';
import { BulkThrottledCache } from '../examples/throttledCache/BulkThrottledCache';

describe("ThrottledCache", () => {

  test("ThrottledCache", async () => {

    const cache = new SimpleThrottledCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve(id));

    await Promise.all([
      cache.get("1"),
      cache.get("1"),
      cache.get("1")
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("BulkThrottledCache", async () => {

    const cache = new BulkThrottledCache();
    const load = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve(id));
    const loadAll = jest.spyOn(cache, "loadAll").mockImplementation(argsArray => Promise.allSettled(argsArray.map(([id]) => Promise.resolve(id))));

    await Promise.all([
      cache.get("1"),
      cache.get("1"),
      cache.get("1"),
      cache.get("2"),
      cache.get("2"),
    ]);

    expect(load).toHaveBeenCalledTimes(0);
    expect(loadAll).toHaveBeenCalledTimes(1);
  });

});
