import { Arrays } from './Arrays';
import { Functions } from './Functions';
import { Objects } from './Objects';
import { Types } from './Types';

export function GroupBy<T extends {}>(data: T[]) {
  return {
    toObject<KEY extends keyof T & PropertyKey, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(
      field: KEY
    ): Readonly<Record<TVAL, T[]>> {
      return new GroupBy.ObjectGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>)
        .build()
        .consumeAll(data).result;
    },
    toMap<KEY extends keyof T, TVAL extends T[KEY] = T[KEY]>(field: KEY): ReadonlyMap<TVAL, T[]> {
      return new GroupBy.MapGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>)
        .build()
        .consumeAll(data).result;
    },
  };
}

export namespace GroupBy {
  export abstract class Accumulator<T, R> {
    public abstract consume(data: T): this;
    public abstract get result(): R;
    public abstract clear(): void;

    public consumeAll(datas: T[]): this {
      for (const data of datas) {
        this.consume(data);
      }
      return this;
    }
  }

  export function toObject<T extends {}>() {
    return {
      byExtractor<KEY extends PropertyKey>(extractor: Functions.MapFunction<T, KEY>): ObjectGroupByBuilder<T, KEY> {
        return new ObjectGroupByBuilder(extractor);
      },
      byField<KEY extends keyof T, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(
        field: KEY
      ): ObjectGroupByBuilder<T, TVAL> {
        return new ObjectGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>);
      },
    };
  }

  export function toMap<T extends {}>() {
    return {
      byExtractor<KEY>(extractor: Functions.MapFunction<T, KEY>): MapGroupByBuilder<T, KEY> {
        return new MapGroupByBuilder(extractor);
      },
      byField<KEY extends keyof T, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(
        field: KEY
      ): MapGroupByBuilder<T, TVAL> {
        return new MapGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>);
      },
    };
  }

  export class ObjectGroupByBuilder<T extends {}, KEY extends PropertyKey> {
    constructor(private readonly keyExtractor: Functions.MapFunction<T, KEY>) {}

    public valueExtractor<VALUE>(
      extractor: Functions.MapFunction<T, VALUE>
    ): ObjectGroupByBuilderWithValue<T, KEY, VALUE> {
      return new ObjectGroupByBuilderWithValue(this.keyExtractor, extractor);
    }

    public build<GROUP>(
      groupAccumulatorsFactory: Functions.Provider<Accumulator<T, GROUP>>
    ): ObjectGroupByAccumulator<T, KEY, T, GROUP>;
    public build(): ObjectGroupByAccumulator<T, KEY, T, T[]>;
    build<GROUP = T[]>(
      groupAccumulatorsFactory?: Functions.Provider<Accumulator<T, GROUP>>
    ): ObjectGroupByAccumulator<T, KEY, T, GROUP | T[]> {
      return new ObjectGroupByBuilderWithValue(this.keyExtractor, (i) => i).build(groupAccumulatorsFactory!);
    }
  }

  export class MapGroupByBuilder<T extends {}, KEY> {
    constructor(private readonly keyExtractor: Functions.MapFunction<T, KEY>) {}

    public valueExtractor<VALUE>(
      extractor: Functions.MapFunction<T, VALUE>
    ): MapGroupByBuilderWithValue<T, KEY, VALUE> {
      return new MapGroupByBuilderWithValue(this.keyExtractor, extractor);
    }

    public build<GROUP>(
      groupAccumulatorsFactory: Functions.Provider<Accumulator<T, GROUP>>
    ): MapGroupByAccumulator<T, KEY, T, GROUP>;
    public build(): MapGroupByAccumulator<T, KEY, T, T[]>;
    build<GROUP = T[]>(
      groupAccumulatorsFactory?: Functions.Provider<Accumulator<T, GROUP>>
    ): MapGroupByAccumulator<T, KEY, T, GROUP | T[]> {
      return new MapGroupByBuilderWithValue(this.keyExtractor, (i) => i).build(groupAccumulatorsFactory!);
    }
  }

  class ObjectGroupByBuilderWithValue<T extends {}, KEY extends PropertyKey, VALUE> {
    constructor(
      private readonly keyExtractor: Functions.MapFunction<T, KEY>,
      private readonly valueExtractor: Functions.MapFunction<T, VALUE>
    ) {}

    public build<GROUP>(
      groupAccumulatorsFactory: Functions.Provider<Accumulator<VALUE, GROUP>>
    ): ObjectGroupByAccumulator<T, KEY, VALUE, GROUP>;
    public build(): ObjectGroupByAccumulator<T, KEY, VALUE, VALUE[]>;
    build<GROUP = VALUE[]>(
      groupAccumulatorsFactory?: Functions.Provider<Accumulator<VALUE, Readonly<GROUP | VALUE[]>>>
    ): ObjectGroupByAccumulator<T, KEY, VALUE, Readonly<GROUP | VALUE[]>> {
      if (!groupAccumulatorsFactory) {
        groupAccumulatorsFactory = () => new ArrayAccumulator<VALUE>();
      }
      return new ObjectGroupByAccumulator(this.keyExtractor, this.valueExtractor, groupAccumulatorsFactory);
    }
  }

  class MapGroupByBuilderWithValue<T extends {}, KEY, VALUE> {
    constructor(
      private readonly keyExtractor: Functions.MapFunction<T, KEY>,
      private readonly valueExtractor: Functions.MapFunction<T, VALUE>
    ) {}

    public build<GROUP>(
      groupAccumulatorsFactory: Functions.Provider<Accumulator<VALUE, GROUP>>
    ): MapGroupByAccumulator<T, KEY, VALUE, GROUP>;
    public build(): MapGroupByAccumulator<T, KEY, VALUE, VALUE[]>;
    build<GROUP = VALUE[]>(
      groupAccumulatorsFactory?: Functions.Provider<Accumulator<VALUE, Readonly<GROUP | VALUE[]>>>
    ): MapGroupByAccumulator<T, KEY, VALUE, Readonly<GROUP | VALUE[]>> {
      if (!groupAccumulatorsFactory) {
        groupAccumulatorsFactory = () => new ArrayAccumulator<VALUE>();
      }
      return new MapGroupByAccumulator(this.keyExtractor, this.valueExtractor, groupAccumulatorsFactory);
    }
  }

  abstract class GroupByAccumulator<T extends {}, KEY, VALUE, GROUP, RESULT_CONTAINER> extends Accumulator<
    T,
    RESULT_CONTAINER
  > {
    private readonly groupAccumulators: Map<KEY, Accumulator<VALUE, GROUP>> = new Map();

    constructor(
      private readonly keyExtractor: Functions.MapFunction<T, KEY>,
      private readonly valueExtractor: Functions.MapFunction<T, VALUE>,
      private readonly groupAccumulatorsFactory: Functions.Provider<Accumulator<VALUE, GROUP>>
    ) {
      super();
    }

    public override consume(data: T): this {
      const key = this.keyExtractor(data);
      const value: VALUE = this.valueExtractor(data);

      let groupAccumulator = this.groupAccumulators.get(key);
      if (groupAccumulator === undefined) {
        groupAccumulator = this.groupAccumulatorsFactory();
        this.groupAccumulators.set(key, groupAccumulator);
        this.set(key, groupAccumulator.result); // ref to result should be stable, by contract
      }

      groupAccumulator.consume(value);
      return this;
    }

    public override clear(): void {
      this.groupAccumulators.clear();
    }

    public abstract set(key: KEY, group: GROUP | Types.DeepReadonly<GROUP>): void;

    // returns object, containing grouped result, no cloning for performance reasons, use returned refs carefully
    public abstract override get result(): Readonly<RESULT_CONTAINER>;
  }

  export class ObjectGroupByAccumulator<T extends {}, KEY extends PropertyKey, VALUE, GROUP> extends GroupByAccumulator<
    T,
    KEY,
    VALUE,
    GROUP,
    Record<KEY, GROUP>
  > {
    readonly #result: Record<KEY, GROUP> = Object.create(null);

    public override set(key: KEY, group: GROUP): void {
      this.#result[key] = group;
    }

    public override get result(): Readonly<Record<KEY, GROUP>> {
      return this.#result;
    }

    public override clear(): void {
      super.clear();
      Objects.forEach(this.#result, (key) => {
        delete this.#result[key];
      });
    }
  }

  export class MapGroupByAccumulator<T extends {}, KEY, VALUE, GROUP> extends GroupByAccumulator<
    T,
    KEY,
    VALUE,
    GROUP,
    ReadonlyMap<KEY, GROUP>
  > {
    readonly #result: Map<KEY, GROUP> = new Map();

    public override set(key: KEY, group: GROUP): void {
      this.#result.set(key, group);
    }

    public override get result(): ReadonlyMap<KEY, GROUP> {
      return this.#result;
    }

    public override clear(): void {
      super.clear();
      this.#result.clear();
    }
  }

  export class ArrayAccumulator<T> extends Accumulator<T, Readonly<T[]>> {
    readonly #result: T[] = [];

    public override consume(data: T): this {
      this.#result.push(data);
      return this;
    }

    public override consumeAll(datas: T[]): this {
      Arrays.pushAll(this.#result, datas);
      return this;
    }

    public override get result(): Readonly<T[]> {
      return this.#result;
    }

    public override clear(): void {
      this.#result.length = 0;
    }
  }
}
