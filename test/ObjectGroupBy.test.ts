import { describe, expect, test } from '@jest/globals';
import { GroupBy } from '../src';

describe("GroupBy", () => {

  interface TestItemABC {
    a: number;
    b: number;
    c: number;
  }

  type TestItemBC = Omit<TestItemABC, "a">;
  type TestItemC = Pick<TestItemABC, "c">;

  const data : TestItemABC[] = [
    {a: 1, b: 1, c: 1},
    {a: 1, b: 1, c: 2},
    {a: 2, b: 1, c: 3},
    {a: 2, b: 2, c: 1},
    {a: 2, b: 2, c: 2},
    {a: 3, b: 2, c: 3},
    {a: 3, b: 3, c: 1}
  ];

  test("shortcut version", () => {
    expect(GroupBy(data).toObject("a")).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    });
  });

  test("basic group by extractor", () => {
    const acc = GroupBy.toObject<TestItemABC>().byExtractor(i => i.a).valueExtractor(i => i).build();

    acc.consume(data[0]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}]
    });

    acc.consume(data[1]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]
    });

    acc.consume(data[2]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}]
    });

    acc.consume(data[3]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}]
    });

    acc.consume(data[4]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}]
    });

    acc.consume(data[5]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}]
    });

    acc.consume(data[6]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    });
  });

  test("basic group by field", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").build();

    acc.consume(data[0]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}]
    });

    acc.consume(data[1]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]
    });

    acc.consume(data[2]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}]
    });

    acc.consume(data[3]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}]
    });

    acc.consume(data[4]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}]
    });

    acc.consume(data[5]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}]
    });

    acc.consume(data[6]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    });
  });

  test("basic with clear", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").build();

    acc.consume(data[0]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}]
    });

    acc.consume(data[1]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]
    });

    acc.consume(data[2]);
    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}]
    });

    acc.clear();

    acc.consume(data[3]);
    expect(acc.result).toEqual({
      "2" : [{a: 2, b: 2, c: 1}]
    });
  });

  test("group by with consume all", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").build();

    acc.consumeAll(data);

    expect(acc.result).toEqual({
      "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    });
  });

  test("null and undefined inside groupBy", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").build();

    acc.consumeAll([
      {a: null!, b: 1, c: 1},
      {a: undefined!, b: 1, c: 2},
      {a: 2, b: 1, c: 3},
      {a: 2, b: 2, c: 1},
      {a: 2, b: 2, c: 2},
      {a: 3, b: 2, c: 3},
      {a: 3, b: 3, c: 1}
    ]);

    expect(acc.result).toEqual({
      "null" : [{a: null!, b: 1, c: 1}],
      "undefined" : [{a: undefined!, b: 1, c: 2}],
      "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
      "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
    });
  });

  test("group by field with value transform", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").valueExtractor(i => i.a).build();

    for (const item of data) {
      acc.consume(item);
    }

    expect(acc.result).toEqual({
      "1" : [1, 1],
      "2" : [2, 2, 2],
      "3" : [3, 3]
    });
  });

  test("group by field with value transform 2", () => {
    const acc = GroupBy.toObject<TestItemABC>().byField("a").valueExtractor(i => ({b: i.b, c: i.c})).build();

    for (const item of data) {
      acc.consume(item);
    }

    expect(acc.result).toEqual({
      "1" : [{b: 1, c: 1}, {b: 1, c: 2}],
      "2" : [{b: 1, c: 3}, {b: 2, c: 1}, {b: 2, c: 2}],
      "3" : [{b: 2, c: 3}, {b: 3, c: 1}]
    });
  });

  test("group by nested sub-grouping", () => {
    const acc = GroupBy.toObject<TestItemABC>()
                    .byField("a")
                    .valueExtractor(i => ({b: i.b, c: i.c} as TestItemBC))
                    .build(
                      () => GroupBy.toObject<TestItemBC>().byField("b").valueExtractor(i => ({c: i.c} as TestItemC)).build()
                    );

    acc.consumeAll(data);

    expect(acc.result).toEqual({
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
    });
  });

  test("triple nested sub-grouping", () => {
    const acc = GroupBy.toObject<TestItemABC>()
                    .byField("a")
                    .build(
                      () => GroupBy.toObject<TestItemABC>().byField("b").build(
                        () => GroupBy.toObject<TestItemABC>().byField("c").valueExtractor(i => ({c: i.c})).build()
                      ));

    for (const item of data) {
      acc.consume(item);
    }

    expect(acc.result).toEqual({
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
    });
  });
});
