[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine/)

# TStools

Zero-dependency and lightweight library with TypeScript utilities.

## Installation

npm

```shell
npm i @stnekroman/tstools
```

yarn

```shell
yarn add @stnekroman/tstools
```

### [Types.ts](src/Types.ts)

Set of pure TypeScript utility types.

### [Arrays.ts](src/Arrays.ts)

Helper methods for operations with arrays.

### [Objects.ts](src/Objects.ts)

Helper methods for operations with objects and different values.

### [Throttle.ts](src/throttle/Throttle.ts)

Implementations of throttle patten (aka debounce)

### [Functions.ts](src/Functions.ts)

Types for functions for better readability with some utilities.  
_Highlights:_

- [Functions.memo](examples/functions/memo.ts) caching/"memoization" of passed function
- [Functions.pipe](examples/functions/pipe.ts) piping/chaining of functions

### [Cache.ts](src/Cache.ts)

Promise-based implemetation of caching.  
_Examples of usage:_

- [SimpleCache.ts](examples/cache/SimpleCache.ts)
- [TwoKeyCache.ts](examples/cache/TwoKeyCache.ts)
- [ObjectArgCache.ts](examples/cache/ObjectArgCache.ts)
- [ObjectKeyCache.ts](examples/cache/ObjectKeyCache.ts)

### [ThrottledCache.ts](src/ThrottledCache.ts)

Combination of Cache + Throttle patterns.  
_Examples of usage:_

- [SimpleThrottledCache.ts](examples/throttledCache/SimpleThrottledCache.ts)
- [BulkThrottledCache.ts](examples/throttledCache/BulkThrottledCache.ts)

### Decorators:

- [Implements](src/decorators/Implements.ts) — like built-in `overrides` keyword, but for ensuring, that method/prop implements one of class'es interface
- [SingletonGuard](src/decorators/SingletonGuard.ts) — ensures that class can have only not more than 1 instance. (`new` invoked only 0 or 1 times)

### [Optional.ts](src/optional/Optional.ts)

Java-port of old good `Optional` monad.  
Usage:

```TypeScript
const value = Optional.of(2)
                      .map(value => value*value)
                      .filter(value => value === 3)
                      .orElse(0);
```

### [Sorter.ts](src/Sorter.ts)

Sorter (comparator) builder - by fieldname or by custom extractor.  
_Examples of usage:_

```TypeScript
const data : Item[] = [
  {a: 1, b: 1},
  {a: 2, b: 1},
  {a: 2, b: 2}
];

// sort by one field
arr.sort(Sorter.byField("a").build());

// sort by two fields - initially by "a", later - by "b"
data.sort(Sorter.byField<Item>("a").build(
  Sorter.byField("b").inverse().build()
));

// by extractor
arr.sort(Sorter.byExtractor<Item>(item => item.c).build());
```

_Look for more in [Sorter.test.ts](test/Sorter.test.ts)_

---

### [GroupBy.ts](src/GroupBy.ts)

GroupBy builder - by fieldname or by extractor to object or map.  
Analog of ES15's Object.groupBy, Map.groupBy but with next differences:

1. Supports inner transform of data during grouping.  
   So while built-in groupBy preserves original items, just groups them to array, - this groupby can (optionally) collect different objects to group arrays.  
   For example, you may want to drop field, which was used for grouping.
2. Built-in approach doesn't support stream processing of data - it expects, that you already have ready-to-use array of input items.  
   While this groupBy accepts each item individually and updates `result`ing accumulator with grouped data automatically on fly.
3. Build-in approach groups only top-level, while ini real life you will face many situations, where you need sub-grouping.  
   Of course, you can post-process result of `Object.groupBy` and group nested groups, but that will mean mode code and additional pass (watch performance)

_Examples of usage:_

```TypeScript
// sample data
const data : TestItemABC[] = [
    {a: 1, b: 1, c: 1},
    {a: 1, b: 1, c: 2},
    {a: 2, b: 1, c: 3},
    {a: 2, b: 2, c: 1},
    {a: 2, b: 2, c: 2},
    {a: 3, b: 2, c: 3},
    {a: 3, b: 3, c: 1}
  ];

// shortcut usage
GroupBy(data).toMap("a");

// result is:
{
  "1" : [{a: 1, b: 1, c: 1}, {a: 1, b: 1, c: 2}],
  "2" : [{a: 2, b: 1, c: 3}, {a: 2, b: 2, c: 1}, {a: 2, b: 2, c: 2}],
  "3" : [{a: 3, b: 2, c: 3}, {a: 3, b: 3, c: 1}]
};

// Fully-qualified usasge:
const acc : GroupBy.ObjectGroupByAccumulator<...> = GroupBy.toObject<TestItemABC>()
                                                           .byExtractor(i => i.a)
                                                           .valueExtractor(i => ({b: i.b, c: i.c}))
                                                           .build();
acc.consume(data[0]);
acc.result; // accumulator's result will contain ready-to-use structure after each consume/insert
acc.consume(data[1]);
acc.result;
acc.consume(data[2]);
...

// With nested grouping
const acc = GroupBy.toObject<TestItemABC>()
                   .byField("a")
                   .valueExtractor(i => ({b: i.b, c: i.c} as TestItemBC))
                   .build( // pass nested grouper
                      () => GroupBy.toObject<TestItemBC>()
                                   .byField("b")
                                   .valueExtractor(i => ({c: i.c} as TestItemC))
                                   .build()
                   );
acc.consumeAll(data);

acc.result; // will contain:

{
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
}
```

Fully-qualified version returns instance of `GroupBy.Accumulator<T, R>` which can be used to collect inputs and build the result.  
It has next methods:

- `consume(data : T) : this` — consumes one individual sample of data
- `consumeAll(datas : T[]) : this` — consumes array of data
- `get result() : Types.DeepReadonly<R>` — reference to container, which contains grouped results
- `clear() : void` — clears this accumulator

_Look for more in [ObjectGroupBy.test.ts](test/ObjectGroupBy.test.ts) or [MapGroupBy.test.ts](test/MapGroupBy.test.ts)_

---

License MIT
