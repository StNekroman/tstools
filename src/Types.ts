// prettier-ignore
export namespace Types {

    export type Primitive = undefined | null | boolean | string | number | bigint | symbol;
    export type Mutable<T> = { -readonly [P in keyof T ]: T[P] };
    export type WithRequired<T, PROPS extends keyof T> = T & Required<Pick<T, PROPS>>;
    export type WithOptional<T, PROPS extends keyof T> = Omit<T, PROPS> & Partial<Pick<T, PROPS>>;
    export type NonFunction<T> = T extends Function ? never : T;
    export type IF<T, BASE, RT = T, RF = never> = T extends BASE ? RT : RF;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export interface Newable<R = {}, ARGS extends any[] = any[]> { new (...args: ARGS) : R; }

    // guard to make sure that type can be serialized - doesn't contain functions.
    export type SerializableObject<T = unknown> = {
      [K in keyof T]: Required<T>[K] extends Function ? never : T[K] & SerializableObject<T[K]>;
    };
    export type Serializable<T = unknown> = SerializableObject<NonFunction<T>>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
    export type LastTypeFromTuple<T extends any[]> = T extends [...infer _, infer L] ? L : never;

    /**
     * Converts array type to union of its elements, or returns the type as-is if not an array
     * @example
     * ArrayToUnion<string> => string
     * ArrayToUnion<string[]> => string
     * ArrayToUnion<'a'> => 'a'
     * ArrayToUnion<['a', 'b']> => 'a' | 'b'
     * ArrayToUnion<readonly ['a', 'b']> => 'a' | 'b'
     */
    export type ArrayToUnion<T> = T extends readonly unknown[] ? T[number] : T;

    export type DeepPartial<T> = {
      [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
    };

    // from https://github.com/iTwin/appui/blob/094a9816957c69b1ee521e4564eaa2262f33df63/ui/appui-react/src/appui-react/redux/redux-ts.ts#L24
    export type DeepReadonly<T> =
        T extends Primitive | Function ? T :
        T extends [] ? DeepReadonlyArray<T> :
        T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> :
        T extends Set<infer M> ? DeepReadonlySet<M> : DeepReadonlyObject<T>;
    export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
    export type DeepReadonlyMap<K, V> = ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>;
    export type DeepReadonlySet<T> = ReadonlySet<DeepReadonly<T>>;
    export type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

    // from https://stackoverflow.com/a/66144780
    export type KeysWithValsOfType<T, V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P };

    export type KeyForValue<E extends Record<PropertyKey, unknown>, V extends E[keyof E]> = {
      [K in keyof E]: E[K] extends V ? (V extends E[K] ? K : never) : never;
    }[keyof E];

    export type FunctionPropertyNames<T> = Types.KeysWithValsOfType<T, (...args: unknown[]) => unknown>;

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
