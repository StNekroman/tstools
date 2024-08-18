
export namespace Functions {

    export type Callback = () => void;
    export type Provider<T> = () => T;
    export type MapFunction<T, R> = (data: T) => R;
    export type Consumer<T> = MapFunction<T, void>;
    export type Filter<T> = MapFunction<T, boolean>;
    export type Comparator<T> = (a: T, b: T) => number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type ArgsConsumer<T extends (...args: any[]) => any> = T;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
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

    export type MemoizedFunction<F extends ArgsConsumer<(...args : any[]) => any>> = {
        (...args: Parameters<F>) : ReturnType<F>;

        clear() : void;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export function memo<F extends ArgsConsumer<(...args : any[]) => any>>(
        func : F,
        cacheId : Functions.MapFunction<Parameters<F>, string> = ((args: Parameters<F>) => args.toString())
    ) : MemoizedFunction<F> {
        const cache = new Map<string, ReturnType<F>>();

        const memoized : MemoizedFunction<F> = ((...args: Parameters<F>) : ReturnType<F> => {
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
