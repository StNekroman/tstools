
export namespace Types {

    export type Primitive = undefined | null | boolean | string | number | Function;
    export type Mutable<T> = { -readonly [P in keyof T ]: T[P] };

    export interface Newable<R = {}, ARGS extends any[] = any[]> { new (...args: ARGS) : R; }

    // guard to make sure that type can be serialized - doesn't contain functions.
    export type Serializable<T = unknown> = {
        [K in keyof T]: Required<T>[K] extends Function ? never : T[K] & Serializable<T[K]>;    
    };

    // from https://github.com/iTwin/appui/blob/094a9816957c69b1ee521e4564eaa2262f33df63/ui/appui-react/src/appui-react/redux/redux-ts.ts#L24
    export type DeepReadonly<T> =
        T extends Primitive ? T :
        T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> :
        T extends Set<infer M> ? DeepReadonlySet<M> : DeepReadonlyObject<T>;
    export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
    export type DeepReadonlyMap<K, V> = ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>;
    export type DeepReadonlySet<T> = ReadonlySet<DeepReadonly<T>>;
    export type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

    // from https://stackoverflow.com/a/66144780
    export type KeysWithValsOfType<T, V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P };

    /**
     * Generates new Type, altering each fields name with prefix/suffix - works for first level only.
     */
    export type addSuffixesToType<TEMPLATE_TYPE, SUFFIXES extends string|number> = {
        [KEY in keyof TEMPLATE_TYPE as `${KEY & string}${SUFFIXES}`] ?: TEMPLATE_TYPE[KEY]
    };
    export type addPrefixesToType<TEMPLATE_TYPE, PREFIXES extends string|number> = {
        [KEY in keyof TEMPLATE_TYPE as `${PREFIXES}${KEY & string}`] ?: TEMPLATE_TYPE[KEY]
    };
}