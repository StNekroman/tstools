import { describe, expect, test } from '@jest/globals';
import { Sorter } from '../src/Sorter';
import { Arrays } from '../src';

type Item = {
  a: number;
  b: number;
  c: number;
};

const data : Item[] = [
  {a: 1, b: 1, c: 1},
  {a: 2, b: 1, c: 1},
  {a: 3, b: 1, c: 1},
  {a: 3, b: 2, c: 1},
  {a: 3, b: 3, c: 1}
];


describe("Sorter", () => {
  test("sorting", () => {

  const arr = Arrays.shuffle([...data]);

  arr.sort(Sorter.byField<Item>("a").build(
    Sorter.byField("b").inverse().build()
  ));

   expect(arr).toStrictEqual([
      {a: 1, b: 1, c: 1},
      {a: 2, b: 1, c: 1},
      {a: 3, b: 3, c: 1},
      {a: 3, b: 2, c: 1},
      {a: 3, b: 1, c: 1}
   ]);
  });
});
