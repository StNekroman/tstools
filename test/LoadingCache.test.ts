
import { describe, expect, jest, test } from '@jest/globals';
import { SimpleCache } from '../examples/cache/SimpleCache';
import { SimpleWeakCache } from '../examples/cache/SimpleWeakCache';

describe("LoadingCache", () => {

  test("SimpleCache", async () => {
    const cache = new SimpleCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve(id));

    await Promise.all([
      cache.get("1"),
      cache.get("1"),
      cache.get("1")
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("SimpleWeakCache", async () => {
    const cache : SimpleWeakCache = new SimpleWeakCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve(id));
    const key = {};

    await Promise.all([
      cache.get(key),
      cache.get(key),
      cache.get(key)
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
  });

});
