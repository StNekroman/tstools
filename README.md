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

### [Throttle.ts](src/Throttle.ts)

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

License MIT
