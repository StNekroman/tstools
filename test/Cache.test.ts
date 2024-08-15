
import { describe, expect, jest, test } from '@jest/globals';
import { ObjectArgCache, RequestObject } from '../examples/cache/ObjectArgCache';
import { SimpleCache } from '../examples/cache/SimpleCache';
import { TwoKeyCache } from '../examples/cache/TwoKeyCache';
import { ObjectKeyCache } from '../examples/cache/ObjectKeyCache';

describe("Cache", () => {

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

  test("TwoKeyCache", async () => {
    const cache = new TwoKeyCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id, secondId) => Promise.resolve("loaded"));

    await Promise.all([
      cache.get("1", 2),
      cache.get("1", 2),
      cache.get("1", 2)
    ]);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("ObjectArgCache", async () => {
    const cache = new ObjectArgCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve({
      data: undefined
    }));

    const key1 : RequestObject = {
      uniqueId: "1"
    };
    const key2 : RequestObject = {
      uniqueId: "2"
    };

    await Promise.all([
      cache.get(key1),
      cache.get(key1),
      cache.get(key2)
    ]);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("ObjectKeyCache", async () => {
    const cache = new ObjectKeyCache();
    const spy = jest.spyOn(cache, "load").mockImplementation((id) => Promise.resolve({
      data: undefined
    }));

    const key1 : RequestObject = {
      uniqueId: "1"
    };
    const key2 : RequestObject = {
      uniqueId: "1"
    };

    await Promise.all([
      cache.get(key1),
      cache.get(key1),
      cache.get(key2)
    ]);

    expect(spy).toHaveBeenCalledTimes(2);

    key1.uniqueId = "2";
    await cache.get(key1);

    expect(spy).toHaveBeenCalledTimes(2);
  });

});
