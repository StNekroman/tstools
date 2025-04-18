/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace Functions {
  export type Callback = () => void;
  export type Provider<T> = () => T;
  export type MapFunction<T, R> = (data: T) => R;
  export type Consumer<T> = MapFunction<T, void>;
  export type Filter<T> = MapFunction<T, boolean>;
  export type Comparator<T> = (a: T, b: T) => number;
  export type ArgsFunction<ARGS extends unknown[], R> = (...args: ARGS) => R;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function noop(..._args: any[]): void {}

  export function identity<T>(arg: T): Provider<T> {
    return (): T => arg;
  }

  export function join<ARGS extends unknown[]>(...functions: ArgsFunction<ARGS, void>[]): ArgsFunction<ARGS, void> {
    return (...args: ARGS): void => {
      for (const func of functions) {
        func(...args);
      }
    };
  }

  export function extractor<T, K extends keyof T = keyof T>(field: K): MapFunction<T, T[K]> {
    return (obj: T): T[typeof field] => {
      return obj[field];
    };
  }

  export type PipedFunction<F extends ArgsFunction<any[], any>> = F & {
    pipe<NEXT extends MapFunction<ReturnType<F>, any>>(
      next: NEXT
    ): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT>>>;
    pipe<NEXT1 extends MapFunction<ReturnType<F>, any>, NEXT2 extends MapFunction<ReturnType<NEXT1>, any>>(
      next1: NEXT1,
      next2: NEXT2
    ): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT2>>>;
    pipe<
      NEXT1 extends MapFunction<ReturnType<F>, any>,
      NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
      NEXT3 extends MapFunction<ReturnType<NEXT2>, any>
    >(
      next1: NEXT1,
      next2: NEXT2,
      next3: NEXT3
    ): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT3>>>;
    pipe<
      NEXT1 extends MapFunction<ReturnType<F>, any>,
      NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
      NEXT3 extends MapFunction<ReturnType<NEXT2>, any>,
      NEXT4 extends MapFunction<ReturnType<NEXT3>, any>
    >(
      next1: NEXT1,
      next2: NEXT2,
      next3: NEXT3,
      next4: NEXT4
    ): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT4>>>;
    pipe<NEXTS extends MapFunction<any, any>[]>(...nexts: NEXTS): PipedFunction<ArgsFunction<Parameters<F>, any>>;
  };

  export function pipe<F extends ArgsFunction<any[], any>>(fn: F): PipedFunction<F>;
  export function pipe<F extends ArgsFunction<any[], any>, NEXT1 extends MapFunction<ReturnType<F>, any>>(
    fn: F,
    next1: NEXT1
  ): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT1>>>;
  export function pipe<
    F extends ArgsFunction<any[], any>,
    NEXT1 extends MapFunction<ReturnType<F>, any>,
    NEXT2 extends MapFunction<ReturnType<NEXT1>, any>
  >(fn: F, next1: NEXT1, next2: NEXT2): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT2>>>;
  export function pipe<
    F extends ArgsFunction<any[], any>,
    NEXT1 extends MapFunction<ReturnType<F>, any>,
    NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
    NEXT3 extends MapFunction<ReturnType<NEXT2>, any>
  >(fn: F, next1: NEXT1, next2: NEXT2, next3: NEXT3): PipedFunction<ArgsFunction<Parameters<F>, ReturnType<NEXT3>>>;
  export function pipe<F extends ArgsFunction<any[], any>>(
    ...fns: F[]
  ): PipedFunction<ArgsFunction<Parameters<F>, any>>;

  export function pipe<F extends ArgsFunction<any[], any>>(
    firstFn: F,
    ...restFns: F[]
  ): PipedFunction<ArgsFunction<Parameters<F>, any>> {
    const piped = ((...args: Parameters<F>): ReturnType<F> => {
      let result = firstFn(...args);
      for (const fn of restFns) {
        result = fn(result);
      }
      return result;
    }) as PipedFunction<F>;

    piped.pipe = (...nexts: F[]) => {
      return Functions.pipe(piped, ...nexts);
    };

    return piped;
  }

  export type MemoizedFunction<F extends ArgsFunction<any[], any>> = {
    (...args: Parameters<F>): ReturnType<F>;

    clear(): void;
  };

  /**
   * @param func given function to memoize
   * @param cacheId function-generator of unique string id for each arguments combination, @defaut is just `.toString()`
   * @returns "memoized"/caching function, which will trigger given function only on argument change
   */
  export function memo<F extends ArgsFunction<any[], any>>(
    func: F,
    cacheId: Functions.MapFunction<Parameters<F>, string> = (args: Parameters<F>) => args.toString()
  ): MemoizedFunction<F> {
    const cache = new Map<string, ReturnType<F>>();

    const memoized = ((...args: Parameters<F>): ReturnType<F> => {
      const cached = cacheId(args);
      if (cache.has(cached)) {
        return cache.get(cached)!;
      } else {
        const result = func(...args);
        cache.set(cached, result);
        return result;
      }
    }) as MemoizedFunction<F>;

    memoized.clear = () => {
      cache.clear();
    };

    return memoized;
  }

  export function retry<F extends ArgsFunction<unknown[], unknown>>(
    func: F,
    count: number = 3,
    onError: Functions.Consumer<unknown> = Functions.noop
  ): ReturnType<F> {
    let lastError: unknown;
    for (let i = 0; i < count; i++) {
      try {
        return func() as ReturnType<F>;
      } catch (e: unknown) {
        lastError = e;
        onError(e);
      }
    }
    throw lastError;
  }

  export async function retryAsync<F extends ArgsFunction<unknown[], Promise<unknown>>>(
    func: F,
    count: number = 3,
    onError: Functions.Consumer<unknown> = Functions.noop
  ): Promise<Awaited<ReturnType<F>>> {
    let lastError: unknown;
    for (let i = 0; i < count; i++) {
      try {
        return (await func()) as Awaited<ReturnType<F>>;
      } catch (e: unknown) {
        lastError = e;
        onError(e);
      }
    }
    throw lastError;
  }
}
