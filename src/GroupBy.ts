import { Implements } from './decorators/Implements';
import { Functions } from './Functions';

export namespace GroupBy {
  export interface Accumulator<T, R> {
    consume(data : T) : void;
    readonly result : R;
  }
}

export namespace GroupBy {
  export function toObject<T extends {}>() {
    return {
      byExtractor<KEY extends PropertyKey>(extractor : Functions.MapFunction<T, KEY>) : ObjectGroupByBuilder<T, KEY> {
        return new ObjectGroupByBuilder(extractor);
      },
      byField<KEY extends keyof T, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(field : KEY) : ObjectGroupByBuilder<T, TVAL> {
        return new ObjectGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>);
      }
    };
  }

  export function toMap<T extends {}>() {
    return {
      byExtractor<KEY>(extractor : Functions.MapFunction<T, KEY>) : MapGroupByBuilder<T, KEY> {
        return new MapGroupByBuilder(extractor);
      },
      byField<KEY extends keyof T, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(field : KEY) : MapGroupByBuilder<T, TVAL> {
        return new MapGroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>);
      }
    };
  }

  class ObjectGroupByBuilder<T extends {}, KEY extends PropertyKey> {

    constructor(private readonly keyExtractor : Functions.MapFunction<T, KEY>) {}

    public valueExtractor<VALUE>(extractor : Functions.MapFunction<T, VALUE>) : ObjectGroupByBuilderWithValue<T, KEY, VALUE> {
      return new ObjectGroupByBuilderWithValue(this.keyExtractor, extractor);
    }

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<T, GROUP>>) : ObjectGroupByAccumulator<T, KEY, T, GROUP>;
    public build() : ObjectGroupByAccumulator<T, KEY, T, T[]>;
    build<GROUP = T[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<T, GROUP>>) : ObjectGroupByAccumulator<T, KEY, T, GROUP | T[]> {
      return new ObjectGroupByBuilderWithValue(this.keyExtractor, i => i).build(groupAccumulatorsFactory!);
    }
  }

  class MapGroupByBuilder<T extends {}, KEY> {

    constructor(private readonly keyExtractor : Functions.MapFunction<T, KEY>) {}

    public valueExtractor<VALUE>(extractor : Functions.MapFunction<T, VALUE>) : MapGroupByBuilderWithValue<T, KEY, VALUE> {
      return new MapGroupByBuilderWithValue(this.keyExtractor, extractor);
    }

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<T, GROUP>>) : MapGroupByAccumulator<T, KEY, T, GROUP>;
    public build() : MapGroupByAccumulator<T, KEY, T, T[]>;
    build<GROUP = T[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<T, GROUP>>) : MapGroupByAccumulator<T, KEY, T, GROUP | T[]> {
      return new MapGroupByBuilderWithValue(this.keyExtractor, i => i).build(groupAccumulatorsFactory!);
    }
  }

  class ObjectGroupByBuilderWithValue<T extends {}, KEY extends PropertyKey, VALUE> {
    constructor(
      private readonly keyExtractor : Functions.MapFunction<T, KEY>,
      private readonly valueExtractor : Functions.MapFunction<T, VALUE>
    ) {}

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<VALUE, GROUP>>) : ObjectGroupByAccumulator<T, KEY, VALUE, GROUP>;
    public build() : ObjectGroupByAccumulator<T, KEY, VALUE, VALUE[]>;
    build<GROUP = VALUE[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<VALUE, GROUP>>) : ObjectGroupByAccumulator<T, KEY, VALUE, GROUP | VALUE[]> {
      if (groupAccumulatorsFactory) {
        return new ObjectGroupByAccumulator(this.keyExtractor, this.valueExtractor, groupAccumulatorsFactory);
      } else {
        return new ObjectGroupByAccumulator(this.keyExtractor, this.valueExtractor, () => new ArrayAccumulator<VALUE>());
      }
    }
  }

  class MapGroupByBuilderWithValue<T extends {}, KEY, VALUE> {
    constructor(
      private readonly keyExtractor : Functions.MapFunction<T, KEY>,
      private readonly valueExtractor : Functions.MapFunction<T, VALUE>
    ) {}

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<VALUE, GROUP>>) : MapGroupByAccumulator<T, KEY, VALUE, GROUP>;
    public build() : MapGroupByAccumulator<T, KEY, VALUE, VALUE[]>;
    build<GROUP = VALUE[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<VALUE, GROUP>>) : MapGroupByAccumulator<T, KEY, VALUE, GROUP | VALUE[]> {
      if (groupAccumulatorsFactory) {
        return new MapGroupByAccumulator(this.keyExtractor, this.valueExtractor, groupAccumulatorsFactory);
      } else {
        return new MapGroupByAccumulator(this.keyExtractor, this.valueExtractor, () => new ArrayAccumulator<VALUE>());
      }
    }
  }

  abstract class GroupByAccumulator<T extends {}, KEY, VALUE, GROUP, RESULT_CONTAINER> implements Accumulator<T, RESULT_CONTAINER> {

    private readonly groupAccumulators : Map<KEY, Accumulator<VALUE, GROUP>> = new Map();

    constructor(
      private readonly keyExtractor : Functions.MapFunction<T, KEY>,
      private readonly valueExtractor : Functions.MapFunction<T, VALUE>,
      private readonly groupAccumulatorsFactory : Functions.Provider<Accumulator<VALUE, GROUP>>
    ) {}

    @Implements<Accumulator<T, RESULT_CONTAINER>>
    public consume(data: T) {
      const key = this.keyExtractor(data);
      const value : VALUE = this.valueExtractor(data);

      let groupAccumulator = this.groupAccumulators.get(key);
      if (groupAccumulator === undefined) {
        groupAccumulator = this.groupAccumulatorsFactory();
        this.groupAccumulators.set(key, groupAccumulator);
        this.set(key, groupAccumulator.result); // ref to result should be stable, by contract
      }

      groupAccumulator.consume(value);
    }

    public abstract set(key: KEY, group: GROUP) : void;

    // returns object, containing grouped result, no cloning for performance reasons, use returned refs carefully
    public abstract get result() : RESULT_CONTAINER;
  }

  export class ObjectGroupByAccumulator<T extends {}, KEY extends PropertyKey, VALUE, GROUP> extends GroupByAccumulator<T, KEY, VALUE, GROUP, Record<KEY, GROUP>> {

    readonly #result : Record<KEY, GROUP> = Object.create(null);

    public override set(key: KEY, group: GROUP) : void {
      this.result[key] = group;
    }

    public override get result() : Record<KEY, GROUP> {
      return this.#result;
    }
  }

  export class MapGroupByAccumulator<T extends {}, KEY, VALUE, GROUP> extends GroupByAccumulator<T, KEY, VALUE, GROUP, Map<KEY, GROUP>> {

    readonly #result : Map<KEY, GROUP> = new Map();

    public override set(key: KEY, group: GROUP) : void {
      this.#result.set(key, group);
    }

    public override get result() : Map<KEY, GROUP> {
      return this.#result;
    }
  }

  export class ArrayAccumulator<T> implements Accumulator<T, T[]> {
    readonly #result : T[] = [];

    @Implements<Accumulator<T, T[]>>
    public consume(data: T): void {
      this.#result.push(data);
    }

    @Implements<Accumulator<T, T[]>>
    public get result() : T[] {
      return this.#result;
    }
  }
}
