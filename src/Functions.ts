
export namespace Functions {

    export type Callback = () => void;
    export type Provider<T> = () => T;
    export type MapFunction<T, R> = (data: T) => R;
    export type Consumer<T> = MapFunction<T, void>;
    export type Filter<T> = MapFunction<T, boolean>;
    export type Comparator<T> = (a: T, b: T) => number;
    export type ArgsConsumer<T extends (...args: any[]) => void> = T;

    export function noop(..._args: any[]) : void {}

    export function identity<T>(arg: T) : Provider<T> {
        return () : T => arg;
    }

    export function compose<V, T, R>(before: MapFunction<V, T>, after: MapFunction<T, R>): MapFunction<V, R> {
        return (input: V): R => {
            return after(before(input));
        };
    }

    export function join<T extends unknown[]>(...functions : ArgsConsumer<(...args : T) => void>[]) : ArgsConsumer<(...args : T) => void> {
        return (...args : T) : void => {
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
}
