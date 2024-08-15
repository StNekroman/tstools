import { describe, expect, test } from '@jest/globals';
import { Arrays } from '../src';
import { Sorter } from '../src/Sorter';

type Item = {
  a: number;
  b: number;
  c: number;
};

const data : Item[] = [
  {a: 1, b: 1, c: 1},
  {a: 2, b: 1, c: 5},
  {a: 3, b: 1, c: 3},
  {a: 3, b: 2, c: 2},
  {a: 3, b: 3, c: 4}
];


describe("Sorter", () => {
  test("sorting by fields", () => {

  const arr = Arrays.shuffle([...data]);

  arr.sort(Sorter.byField<Item>("a").build(
    Sorter.byField("b").inverse().build()
  ));

   expect(arr).toStrictEqual([
      {a: 1, b: 1, c: 1},
      {a: 2, b: 1, c: 5},
      {a: 3, b: 3, c: 4},
      {a: 3, b: 2, c: 2},
      {a: 3, b: 1, c: 3}
   ]);
  });

test("sorting by extractor", () => {

  const arr : Item[] = Arrays.shuffle([...data]);

  arr.sort((i1, i2) => i2.c - i1.c);

  arr.sort(Sorter.byExtractor<Item>(item => item.c).build());

   expect(arr).toStrictEqual([
      {a: 1, b: 1, c: 1},
      {a: 3, b: 2, c: 2},
      {a: 3, b: 1, c: 3},
      {a: 3, b: 3, c: 4},
      {a: 2, b: 1, c: 5}
   ]);
  });
});
