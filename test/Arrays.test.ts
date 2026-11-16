import { describe, expect, test } from "@jest/globals";
import { Arrays } from "../src/Arrays";

describe("Arrays", () => {
  test("deleteItem", () => {
    let arr = [1, 2, 3];
    expect(Arrays.deleteItem(arr, 3)).toBe(true);
    expect(arr).toStrictEqual([1, 2]);

    arr = [1, 2, 3];
    expect(Arrays.deleteItem(arr, 5)).toBe(false);
    expect(arr).toStrictEqual([1, 2, 3]);
  });

  test("pushAll", () => {
    expect(Arrays.pushAll([], [2, 3])).toStrictEqual([2, 3]);
    expect(Arrays.pushAll([1], [2, 3])).toStrictEqual([1, 2, 3]);
    expect(Arrays.pushAll([1], [1, 2, 3])).toStrictEqual([1, 1, 2, 3]);
    expect(Arrays.pushAll([1], [])).toStrictEqual([1]);
  });

  test("shuffle", () => {
    const arr = [1, 2, 3];
    const shuffled = Arrays.shuffle(arr);
    expect(shuffled).toBe(arr); // shuffles in place
    expect([...shuffled].sort()).toStrictEqual([1, 2, 3]);

    expect(Arrays.shuffle([])).toStrictEqual([]);
    expect(Arrays.shuffle([1])).toStrictEqual([1]);
  });

  test("shuffle is uniform", () => {
    // 3 elements -> 6 permutations, each expected 1000 times out of 6000.
    // std dev is ~29, so the [800, 1200] window is ~7 sigma: not flaky.
    const counts = new Map<string, number>();
    for (let i = 0; i < 6000; i++) {
      const key = Arrays.shuffle([1, 2, 3]).join("");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    expect([...counts.keys()].sort()).toStrictEqual(["123", "132", "213", "231", "312", "321"]);
    for (const count of counts.values()) {
      expect(count).toBeGreaterThan(800);
      expect(count).toBeLessThan(1200);
    }
  });

  test("filterUntil", () => {
    const filtered = Arrays.filterUntil(
      [1, 2, 3, 10, 11, 12, 7, 8, 9],
      (i) => i < 10
    );
    expect(filtered).toStrictEqual([1, 2, 3]);
  });

  test("filterUntil, include last", () => {
    const filtered = Arrays.filterUntil(
      [1, 2, 3, 10, 11, 12, 7, 8, 9],
      (i) => i < 10,
      true
    );
    expect(filtered).toStrictEqual([1, 2, 3, 10]);
  });

  test("haveIntersection", () => {
    expect(Arrays.haveIntersection([], [])).toBe(false);
    expect(Arrays.haveIntersection([1], [])).toBe(false);
    expect(Arrays.haveIntersection([], [1])).toBe(false);
    expect(Arrays.haveIntersection([1], [2])).toBe(false);
    expect(Arrays.haveIntersection([1, 2], [3, 4])).toBe(false);

    expect(Arrays.haveIntersection([1], [1])).toBe(true);
    expect(Arrays.haveIntersection([1], [1, 2])).toBe(true);
    expect(Arrays.haveIntersection([2], [1, 2])).toBe(true);
    expect(Arrays.haveIntersection([1], [1, 2])).toBe(true);
    expect(Arrays.haveIntersection([1, 2], [1, 2])).toBe(true);
    expect(Arrays.haveIntersection([1, 2], [2, 3])).toBe(true);
    expect(Arrays.haveIntersection([1, 2, 3], [2])).toBe(true);
  });
});
