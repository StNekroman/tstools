import { Implements } from './decorators/Implements';
import { Functions } from './Functions';
import { Types } from './Types';


export class GroupBy<T extends {}> {

  public byExtractor<KEY extends PropertyKey>(extractor : Functions.MapFunction<T, KEY>) : GroupBy.GroupByBuilder<T, KEY> {
    return new GroupBy.GroupByBuilder(extractor);
  }

  public byField<KEY extends keyof T, TVAL extends PropertyKey & T[KEY] = T[KEY] & PropertyKey>(field : KEY) : GroupBy.GroupByBuilder<T, TVAL> {
    return new GroupBy.GroupByBuilder(Functions.extractor<T>(field) as Functions.MapFunction<T, TVAL>);
  }
}

export namespace GroupBy {

  export interface Accumulator<T, R> {
    consume(data : T) : void;
    readonly result : R;
  }

  export class GroupByBuilder<T extends {}, KEY extends PropertyKey> {

    constructor(private readonly keyExtractor : Functions.MapFunction<T, KEY>) {}

    public valueExtractor<VALUE>(extractor : Functions.MapFunction<T, VALUE>) : GroupByBuilderWithValue<T, KEY, VALUE> {
      return new GroupByBuilderWithValue(this.keyExtractor, extractor);
    }

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<T, GROUP>>) : GroupByAccumulator<T, KEY, T, GROUP>;
    public build() : GroupByAccumulator<T, KEY, T, T[]>;
    build<GROUP = T[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<T, GROUP>>) : GroupByAccumulator<T, KEY, T, GROUP | T[]> {
      return new GroupByBuilderWithValue(this.keyExtractor, i => i).build(groupAccumulatorsFactory!);
    }
  }

  class GroupByBuilderWithValue<T extends {}, KEY extends PropertyKey, VALUE> {
    constructor(
      private readonly keyExtractor : Functions.MapFunction<T, KEY>,
      private readonly valueExtractor : Functions.MapFunction<T, VALUE>
    ) {}

    public build<GROUP>(groupAccumulatorsFactory : Functions.Provider<Accumulator<VALUE, GROUP>>) : GroupByAccumulator<T, KEY, VALUE, GROUP>;
    public build() : GroupByAccumulator<T, KEY, VALUE, VALUE[]>;
    build<GROUP = VALUE[]>(groupAccumulatorsFactory ?: Functions.Provider<Accumulator<VALUE, GROUP>>) : GroupByAccumulator<T, KEY, VALUE, GROUP | VALUE[]> {
      if (groupAccumulatorsFactory) {
        return new GroupByAccumulator(this.keyExtractor, this.valueExtractor, groupAccumulatorsFactory);
      } else {
        return new GroupByAccumulator(this.keyExtractor, this.valueExtractor, () => new ArrayAccumulator<VALUE>());
      }
    }
  }

  export class GroupByAccumulator<T extends {}, KEY extends PropertyKey, VALUE, GROUP> implements Accumulator<T, Record<KEY, GROUP>> {

    readonly #result : Record<KEY, GROUP> = Object.create(null);
    private readonly groupAccumulators : Map<KEY, Accumulator<VALUE, GROUP>> = new Map();

    constructor(
      private readonly keyExtractor : Functions.MapFunction<T, KEY>,
      private readonly valueExtractor : Functions.MapFunction<T, VALUE>,
      private readonly groupAccumulatorsFactory : Functions.Provider<Accumulator<VALUE, GROUP>>
    ) {}

    @Implements<Accumulator<T, Record<KEY, GROUP>>>
    public consume(data: T) {
      const key = this.keyExtractor(data);
      const value : VALUE = this.valueExtractor(data);

      let groupAccumulator = this.groupAccumulators.get(key);
      if (groupAccumulator === undefined) {
        groupAccumulator = this.groupAccumulatorsFactory();
        this.groupAccumulators.set(key, groupAccumulator);
        this.result[key] = groupAccumulator.result; // ref to result should be stable, by contract
      }

      groupAccumulator.consume(value);
    }

    // returns object, containing grouped result, no cloning for performance reasons, use returned refs carefully
    @Implements<Accumulator<T, Record<KEY, GROUP>>>
    public get result() : Record<KEY, GROUP> {
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








  export class GroupByBuilderWithData<T extends {}, KEY extends PropertyKey> extends GroupByBuilder<T, KEY> {
    constructor(private data: T[], keyExtractor : Functions.MapFunction<T, KEY>) {
      super(keyExtractor);
    }
  };


}
