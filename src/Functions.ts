/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace Functions {

    export type Callback = () => void;
    export type Provider<T> = () => T;
    export type MapFunction<T, R> = (data: T) => R;
    export type Consumer<T> = MapFunction<T, void>;
    export type Filter<T> = MapFunction<T, boolean>;
    export type Comparator<T> = (a: T, b: T) => number;
    export type ArgsConsumer<T extends (...args: any[]) => any> = T;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export function noop(..._args: any[]) : void {}

    export function identity<T>(arg: T) : Provider<T> {
        return () : T => arg;
    }

    export function compose<V, T, R>(before: MapFunction<V, T>, after: MapFunction<T, R>): MapFunction<V, R> {
        return (input: V): R => {
            return after(before(input));
        };
    }

    export function join<ARGS extends unknown[]>(...functions : ArgsConsumer<(...args : ARGS) => void>[]) : ArgsConsumer<(...args : ARGS) => void> {
        return (...args : ARGS) : void => {
            for (const func of functions) {
                func(...args);
            }
        };
    }

    export function extractor<T, F extends keyof T>(field : F) : MapFunction<T, T[F]> {
        return (obj: T) : T[F] => {
            return obj[field];
        };
    }

    export type PipedFunction<F extends ArgsConsumer<(...args : any[]) => any>> = F & {

        pipe<NEXT extends MapFunction<ReturnType<F>, any>>(next : NEXT) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT>>>;
        pipe<
            NEXT1 extends MapFunction<ReturnType<F>, any>,
            NEXT2 extends MapFunction<ReturnType<NEXT1>, any>
        >(next1 : NEXT1, next2 : NEXT2) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT2>>>;
        pipe<
            NEXT1 extends MapFunction<ReturnType<F>, any>,
            NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
            NEXT3 extends MapFunction<ReturnType<NEXT2>, any>
        >(next1 : NEXT1, next2 : NEXT2, next3 : NEXT3) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT3>>>;
        pipe<
            NEXT1 extends MapFunction<ReturnType<F>, any>,
            NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
            NEXT3 extends MapFunction<ReturnType<NEXT2>, any>,
            NEXT4 extends MapFunction<ReturnType<NEXT3>, any>
        >(next1 : NEXT1, next2 : NEXT2, next3 : NEXT3, next4 : NEXT4) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT4>>>;
        pipe<
            NEXTS extends MapFunction<any, any>[]
        >(...nexts : NEXTS) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => any>>;
    };


    export function pipe<F extends ArgsConsumer<(...args : any[]) => any>>(fn : F) : PipedFunction<F>;
    export function pipe<
        F extends ArgsConsumer<(...args : any[]) => any>,
        NEXT1 extends MapFunction<ReturnType<F>, any>
    >(fn : F, next1: NEXT1) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT1>>>;
    export function pipe<
        F extends ArgsConsumer<(...args : any[]) => any>,
        NEXT1 extends MapFunction<ReturnType<F>, any>,
        NEXT2 extends MapFunction<ReturnType<NEXT1>, any>
    >(fn : F, next1: NEXT1, next2: NEXT2) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT2>>>;
    export function pipe<
        F extends ArgsConsumer<(...args : any[]) => any>,
        NEXT1 extends MapFunction<ReturnType<F>, any>,
        NEXT2 extends MapFunction<ReturnType<NEXT1>, any>,
        NEXT3 extends MapFunction<ReturnType<NEXT2>, any>
    >(fn : F, next1: NEXT1, next2: NEXT2, next3: NEXT3) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => ReturnType<NEXT3>>>;
    export function pipe<F extends ArgsConsumer<(...args : any[]) => any>>(...fns : F[]) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => any>>;

    export function pipe<F extends ArgsConsumer<(...args : any[]) => any>>(firstFn: F, ...restFns : F[]) : PipedFunction<ArgsConsumer<(...args : Parameters<F>) => any>> {
        const piped = ((...args: Parameters<F>) : ReturnType<F> => {
            let result = firstFn(...args);
            for (const fn of restFns) {
                result = fn(result);
            }
            return result;
        }) as PipedFunction<F>;

        piped.pipe = (...nexts : F[]) => {
            return Functions.pipe(piped, ...nexts);
        };

        return piped;
    }

    export type MemoizedFunction<F extends ArgsConsumer<(...args : any[]) => any>> = {
        (...args: Parameters<F>) : ReturnType<F>;

        clear() : void;
    };

    /**
     * @param func given function to memoize
     * @param cacheId function-generator of unique string id for each arguments combination, @defaut is just `.toString()`
     * @returns "memoized"/caching function, which will trigger given function only on argument change
     */
    export function memo<F extends ArgsConsumer<(...args : any[]) => any>>(
        func : F,
        cacheId : Functions.MapFunction<Parameters<F>, string> = ((args: Parameters<F>) => args.toString())
    ) : MemoizedFunction<F> {
        const cache = new Map<string, ReturnType<F>>();

        const memoized = ((...args: Parameters<F>) : ReturnType<F> => {
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
}
