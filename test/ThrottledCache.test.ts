
import { describe, expect, jest, test } from '@jest/globals';
import { BulkThrottledCache } from '../examples/throttledCache/BulkThrottledCache';
import { SimpleThrottledCache } from '../examples/throttledCache/SimpleThrottledCache';

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

  test("one reject doesn't crash the world", async () => {
    const cache = new BulkThrottledCache();
    const load = jest.spyOn(cache, "load").mockImplementation((id) => {
      if (id === "3") {
        return Promise.reject("bad id, unknown for server");
      }
      return Promise.resolve(id);
    });
    const loadAll = jest.spyOn(cache, "loadAll").mockImplementation(argsArray => Promise.allSettled(argsArray.map(([id]) => {
      if (id === "3") {
        return Promise.reject("bad id, unknown for server");
      }
      return Promise.resolve(id);
    })));

    await Promise.allSettled([
      Promise.all([
          cache.get("1"),
          cache.get("1"),
          cache.get("1"),
          cache.get("2"),
          cache.get("2")
      ]),
      cache.get("3")
    ]);

    expect(load).toHaveBeenCalledTimes(0);
    expect(loadAll).toHaveBeenCalledTimes(1);
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

  test("clear cache while requests in flight", async () => {
    const cache = new BulkThrottledCache();
    const load = jest.spyOn(cache, "load").mockImplementation((id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => resolve(id), 200);
      });
    });

    const promise = cache.get("1");

    cache.clear();

    await expect(promise).rejects.toEqual("clear cache");
  });

});
