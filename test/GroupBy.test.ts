import { describe, expect, test } from '@jest/globals';
import { Objects, GroupBy } from '../src';

describe("GroupBy", () => {

  const data = [
    {a: 1, b: 1, c: 1},
    {a: 1, b: 1, c: 2},
    {a: 2, b: 1, c: 3},
    {a: 2, b: 2, c: 1},
    {a: 2, b: 2, c: 2},
    {a: 3, b: 2, c: 3},
    {a: 3, b: 3, c: 1}
  ];

   test("basic group by extractor", () => {
    const acc = new GroupBy<typeof data[0]>().byExtractor(i => i.a).valueExtractor(i => i).build();

    acc.consume(data[0]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}]
    })).toBeTruthy();

    acc.consume(data[1]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]
    })).toBeTruthy();

    acc.consume(data[2]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}]
    })).toBeTruthy();

    acc.consume(data[3]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}]
    })).toBeTruthy();

    acc.consume(data[4]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}]
    })).toBeTruthy();

    acc.consume(data[5]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}]
    })).toBeTruthy();

    acc.consume(data[6]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    })).toBeTruthy();
  });

  test("basic group by field", () => {
    const acc = new GroupBy<typeof data[0]>().byField("a").build();

    acc.consume(data[0]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}]
    })).toBeTruthy();

    acc.consume(data[1]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]
    })).toBeTruthy();

    acc.consume(data[2]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}]
    })).toBeTruthy();

    acc.consume(data[3]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}]
    })).toBeTruthy();

    acc.consume(data[4]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}]
    })).toBeTruthy();

    acc.consume(data[5]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}]
    })).toBeTruthy();

    acc.consume(data[6]);
    expect(Objects.equals(acc.result, {
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    })).toBeTruthy();
  });

  test("group by field with value transform", () => {
    const acc = new GroupBy<typeof data[0]>().byField("a").valueExtractor(i => i.a).build();

    for (const item of data) {
      acc.consume(item);
    }

    expect(Objects.equals(acc.result, {
      "1" : [1, 1],
      "2" : [2, 2, 2],
      "3" : [3, 3]
    })).toBeTruthy();
  });

  test("group by field with value transform 2", () => {
    const acc = new GroupBy<typeof data[0]>().byField("a").valueExtractor(i => ({b: i.b, c: i.c})).build();

    for (const item of data) {
      acc.consume(item);
    }

    expect(Objects.equals(acc.result, {
      "1" : [{b: 1, c: 1}, {b: 1, c: 2}],
      "2" : [{b: 1, c: 3}, {b: 2, c: 1}, {b: 2, c: 2}],
      "3" : [{b: 2, c: 3}, {b: 3, c: 1}]
    })).toBeTruthy();
  });

  test("group by nested sub-grouping", () => {
    const acc = new GroupBy<typeof data[0]>()
                    .byField("a")
                    .valueExtractor(i => ({b: i.b, c: i.c}))
                    .build(
                      () => new GroupBy<{b: number, c: number}>().byField("b").valueExtractor(i => ({c: i.c})).build()
                    );

    for (const item of data) {
      acc.consume(item);
    }

    expect(Objects.equals(acc.result, {
      "1" : {
        "1": [{c: 1}, {c: 2}]
      },
      "2" : {
        "1": [{c: 3}],
        "2": [{c: 1}, {c: 2}]
      },
      "3": {
        "2": [{c: 3}],
        "3": [{c: 1}]
      }
    })).toBeTruthy();
  });

  test("triple nested sub-grouping", () => {
    const acc = new GroupBy<typeof data[0]>()
                    .byField("a")
                    .build(
                      () => new GroupBy<typeof data[0]>().byField("b").build(
                        () => new GroupBy<typeof data[0]>().byField("c").valueExtractor(i => ({c: i.c})).build()
                      )
                    );

    for (const item of data) {
      acc.consume(item);
    }

    expect(Objects.equals(acc.result, {
      "1" : {
        "1": {
          "1": [{c: 1}],
          "2": [{c: 2}]
        }
      },
      "2" : {
        "1": {
          "3": [{c: 3}]
        },
        "2": {
          "1": [{c: 1}],
          "2": [{c: 2}]
        }
      },
      "3": {
        "2": {
          "3": [{c: 3}]
        },
        "3": {
          "1": [{c: 1}]
        }
      }
    })).toBeTruthy();
  });
});
