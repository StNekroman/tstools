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
    const expected = new Map<number, TestItemABC[]>();
    expected.set(1, [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}]);
    expected.set(2, [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}]);
    expected.set(3, [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]);
    expect(GroupBy(data).toMap("a")).toEqual(expected);
  });

   test("basic group by extractor", () => {
    const acc = GroupBy.toMap<TestItemABC>().byExtractor(i => i.a).valueExtractor(i => i).build();
    const expected = new Map<number, TestItemABC[]>();

    acc.consume(data[0]);
    expected.set(1, [data[0]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[1]);
    expected.get(1)!.push(data[1]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[2]);
    expected.set(2, [data[2]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[3]);
    expected.get(2)!.push(data[3]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[4]);
    expected.get(2)!.push(data[4]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[5]);
    expected.set(3, [data[5]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[6]);
    expected.get(3)!.push(data[6]);
    expect(acc.result).toEqual(expected);
  });

  test("basic group by field", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").build();
    const expected = new Map<number, TestItemABC[]>();

    acc.consume(data[0]);
    expected.set(1, [data[0]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[1]);
    expected.get(1)!.push(data[1]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[2]);
    expected.set(2, [data[2]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[3]);
    expected.get(2)!.push(data[3]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[4]);
    expected.get(2)!.push(data[4]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[5]);
    expected.set(3, [data[5]]);
    expect(acc.result).toEqual(expected);

    acc.consume(data[6]);
    expected.get(3)!.push(data[6]);
    expect(acc.result).toEqual(expected);
  });

  test("basic with clear", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").build();
    const expected = new Map<number, TestItemABC[]>();

    acc.consume(data[0]);
    expected.set(1, [data[0]]);
    expect(acc.result).toEqual(expected);

    acc.clear();
    expected.clear();
    expect(acc.result).toEqual(expected);

    acc.consume(data[1]);
    expected.set(1, [data[1]]);
    expect(acc.result).toEqual(expected);
  });

  test("group by with consume all", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").valueExtractor(i => i.a).build();

    acc.consumeAll(data);

    const expected = new Map<number, number[]>();
    expected.set(1, [1, 1]);
    expected.set(2, [2, 2, 2]);
    expected.set(3, [3, 3]);

    expect(acc.result).toEqual(expected);
  });

  test("null and undefined inside groupBy", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").valueExtractor(i => i.a).build();

    acc.consumeAll([
      {a: null!, b: 1, c: 1},
      {a: undefined!, b: 1, c: 2},
      {a: 2, b: 1, c: 3},
      {a: 2, b: 2, c: 1},
      {a: 2, b: 2, c: 2},
      {a: 3, b: 2, c: 3},
      {a: 3, b: 3, c: 1}
    ]);

    const expected = new Map<number, number[]>();
    expected.set(null!, [null!]);
    expected.set(undefined!, [undefined!]);
    expected.set(2, [2, 2, 2]);
    expected.set(3, [3, 3]);

    expect(acc.result).toEqual(expected);
  });

  test("group by field with value transform", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").valueExtractor(i => i.a).build();

    for (const item of data) {
      acc.consume(item);
    }

    const expected = new Map<number, number[]>();
    expected.set(1, [1, 1]);
    expected.set(2, [2, 2, 2]);
    expected.set(3, [3, 3]);

    expect(acc.result).toEqual(expected);
  });

  test("group by field with value transform 2", () => {
    const acc = GroupBy.toMap<TestItemABC>().byField("a").valueExtractor(i => ({b: i.b, c: i.c} as TestItemBC)).build();

    for (const item of data) {
      acc.consume(item);
    }

    const expected = new Map<number, TestItemBC[]>();
    expected.set(1, [{b: 1, c: 1}, {b: 1, c: 2}]);
    expected.set(2, [{b: 1, c: 3}, {b: 2, c: 1}, {b: 2, c: 2}]);
    expected.set(3, [{b: 2, c: 3}, {b: 3, c: 1}]);
    expect(acc.result).toEqual(expected);
  });

  test("group by nested sub-grouping", () => {
    const acc = GroupBy.toMap<TestItemABC>()
                    .byField("a")
                    .valueExtractor(i => ({b: i.b, c: i.c} as TestItemBC))
                    .build(
                      () => GroupBy.toMap<TestItemBC>().byField("b").valueExtractor(i => ({c: i.c} as TestItemC)).build()
                    );

    for (const item of data) {
      acc.consume(item);
    }

    const expected = new Map<number, Map<number, TestItemC[]>>();
    expected.set(1, new Map().set(1, [{c: 1}, {c: 2}]));
    expected.set(2, new Map().set(1, [{c: 3}]).set(2, [{c: 1}, {c: 2}]));
    expected.set(3, new Map().set(2, [{c: 3}]).set(3, [{c: 1}]));
    expect(acc.result).toEqual(expected);
  });

  test("group to map with nested object", () => {
    const acc = GroupBy.toMap<TestItemABC>()
                    .byField("a")
                    .build(
                      () => GroupBy.toObject<TestItemABC>().byField("b").valueExtractor(i => ({c: i.c} as TestItemC)).build()
                    );

    for (const item of data) {
      acc.consume(item);
    }

    const expected = new Map<number, Record<number, TestItemC[]>>();
    expected.set(1, {"1": [{c: 1}, {c: 2}]});
    expected.set(2, {
      "1": [{c: 3}],
      "2": [{c: 1}, {c: 2}]
    });
    expected.set(3, {
      "2": [{c: 3}],
      "3": [{c: 1}]
    });
    expect(acc.result).toEqual(expected);
  });
});
