
import { describe, expect, test } from '@jest/globals';
import { Arrays } from '../src/Arrays';

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
    const shuffled = Arrays.shuffle([1, 2, 3]);
    expect(shuffled).toBeDefined();
    expect(shuffled).not.toStrictEqual([1, 2, 3]);
  });

  test("filterUntil", () => {
    const filtered = Arrays.filterUntil([1, 2, 3, 10, 11, 12, 7, 8, 9], (i) => i < 10);
    expect(filtered).toStrictEqual([1, 2, 3]);
  });

  test("filterUntil, include last", () => {
    const filtered = Arrays.filterUntil([1, 2, 3, 10, 11, 12, 7, 8, 9], (i) => i < 10, true);
    expect(filtered).toStrictEqual([1, 2, 3, 10]);
  });
});
