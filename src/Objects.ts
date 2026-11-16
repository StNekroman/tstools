import { type Types } from './Types';

export namespace Objects {
  export function isNotNullOrUndefined<T>(arg: T | null | undefined): arg is NonNullable<T> {
    return arg !== null && arg !== undefined;
  }

  export function isNullOrUndefined<T>(arg: T | null | undefined): arg is null | undefined {
    return arg === null || arg === undefined;
  }

  export function isObject<T = {}>(arg: unknown | T): arg is Record<keyof T, T[keyof T]> {
    return typeof arg === 'object' && arg !== null && !Array.isArray(arg);
  }

  export function isFunction(arg: unknown): arg is Function {
    return typeof arg === 'function';
  }

  export function isArray<T>(arg: unknown): arg is T[] {
    return Array.isArray(arg) || arg instanceof Array;
  }

  export function isString(arg: unknown): arg is string {
    return typeof arg === 'string';
  }

  export function isNumeric(arg: unknown): arg is number {
    if (!Objects.isNotNullOrUndefined(arg)) {
      return false;
    }
    return typeof arg === 'bigint' || (typeof arg === 'number' && !isNaN(arg as number));
  }

  export function isBoolean(arg: unknown): arg is boolean {
    return typeof arg === 'boolean';
  }

  export function isPrimitive(arg: unknown): arg is Types.Primitive {
    if (!Objects.isNotNullOrUndefined(arg)) {
      return true;
    }

    if (Objects.isObject(arg) || Objects.isFunction(arg) || Array.isArray(arg)) {
      return false;
    } else {
      return true;
    }
  }

  export function forEach<T extends {}>(obj: T, callback: (key: keyof T, value: T[keyof T]) => void): void {
    for (const key of Objects.keys(obj)) {
      callback(key, obj[key]);
    }
  }

  /**
   * @param test object
   * @param targetClass target class (constructor) to test against
   * @returns true, of given test object is constructor of class, which extends target class (actually constructor)
   */
  export function isConstructorOf<T>(test: unknown, targetClass: Types.Newable<T>): test is Types.Newable<T> {
    if (test === targetClass) {
      return true;
    }

    if (Objects.isFunction(test)) {
      let prototype = test.prototype;
      while (prototype) {
        if (prototype instanceof targetClass) {
          return true;
        }
        prototype = prototype.prototype;
      }
    }

    return false;
  }

  export function equals<T1, T2>(obj1?: T1, obj2?: T2): boolean {
    if ((obj1 as unknown) === (obj2 as unknown)) {
      return true;
    }

    if (!obj1 || !obj2) {
      return false;
    }

    if (typeof obj1 !== typeof obj2) {
      return false;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!Objects.equals(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }

    if (Objects.isObject(obj1) && Objects.isObject(obj2)) {
      const proto1 = Object.getPrototypeOf(obj1);
      const proto2 = Object.getPrototypeOf(obj2);
      if (proto1 !== proto2) {
        return false;
      }

      const keys1 = Objects.keys(obj1);
      const keys2 = Objects.keys(obj2);
      if (keys1.length !== keys2.length) {
        return false;
      }

      if (proto1 === Date.prototype && proto2 === Date.prototype && obj1 instanceof Date && obj2 instanceof Date) {
        return obj1.getTime() === obj2.getTime();
      }

      if (
        proto1 === RegExp.prototype &&
        proto2 === RegExp.prototype &&
        obj1 instanceof RegExp &&
        obj2 instanceof RegExp
      ) {
        return obj1.source === obj2.source && obj1.flags === obj2.flags;
      }

      const keys2set = new Set(keys2);
      for (const key of keys1) {
        if (!Objects.equals(obj1[key as keyof T1], obj2[key as keyof T2])) {
          return false;
        }
        keys2set.delete(key as keyof T2);
      }

      return keys2set.size === 0;
    }

    return false;
  }

  export function keys<T extends Record<PropertyKey, unknown>>(obj: T): ReadonlyArray<keyof T> {
    return Object.keys(obj);
  }

  export function assign<T extends {}>(target: T, source: Partial<T>): T {
    return Object.assign(target, source);
  }

  /**
   * Not an analog of structuredClone (which is more low-level copying for data serialization).
   * when @param transferNotCopyable set to `false` - it will perform like structuredClone, but not all fields types are covered and it won't create copies of strings - they will go by reference. When unable to clone - expection raised.
   * when @param transferNotCopyable set to `true` - will try to clone, if not cloneable - just a ref will be copies/transferred.
   */
  export function deepCopy<T>(obj: Types.SerializableObject<T>): T;
  export function deepCopy<T>(obj: T, transferNotCopyable: true): T;
  export function deepCopy<T>(obj: T | Types.SerializableObject<T>, transferNotCopyable?: true): T {
    if (Objects.isPrimitive(obj)) {
      return obj;
    }

    if (obj instanceof Date) {
      const date: Date = new Date();
      date.setTime(obj.getTime());
      return date as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => deepCopy(item, transferNotCopyable!)) as T;
    }

    if (Objects.isObject(obj)) {
      const copy: T = {} as T;
      Objects.forEach(obj, (key: keyof T, value: T[keyof T]): void => {
        copy[key] = Objects.deepCopy(value, transferNotCopyable!);
      });
      return copy;
    }

    if (transferNotCopyable) {
      return obj;
    } else {
      throw new Error('Cannot clone not-copyable fields (methods inside?) during Objects.deepCopy.');
    }
  }

  /**
   * Backed by Objects.deepCopy(..., true), so you can pass obj with functions - they will be mapped to dst objection as is.
   * @param dst - target destination object to modify / extend
   * @param src  - source of incomming changes
   * @returns true, if dst object was modified
   */
  export function extend<DST extends {}, SRC extends {}>(
    dst: DST,
    src: SRC,
    options?: {
      canOverwrite?: <DST extends {}, SRC extends {}>(dst: DST, src: SRC, key: keyof SRC) => boolean;
    },
  ): boolean {
    const canOverwrite = options?.canOverwrite ?? (() => true);

    let changed = false;
    if (Objects.isNotNullOrUndefined(src)) {
      Objects.forEach(src, (key: keyof SRC | keyof DST, value: SRC[keyof SRC]): void => {
        if (Objects.isObject(value) && Objects.isObject(dst[key as keyof DST])) {
          // look deeper...
          changed ||= Objects.extend(dst[key as keyof DST] as {}, value);
        } else {
          const overwrite = canOverwrite(dst, src, key as keyof SRC);
          if (overwrite) {
            // no merge, just pick a copy
            dst[key as unknown as keyof typeof dst] = Objects.deepCopy(
              src[key as keyof SRC],
              true,
            ) as unknown as (typeof dst)[keyof typeof dst];
          }
          changed ||= overwrite;
        }
      });
    }
    return changed;
  }

  // from https://stackoverflow.com/a/69330363
  export function isCharacterWhitespace(c: string): boolean {
    return (
      c === ' ' ||
      c === '\n' ||
      c === '\t' ||
      c === '\r' ||
      c === '\f' ||
      c === '\v' ||
      c === '\u00a0' ||
      c === '\u1680' ||
      c === '\u2000' ||
      c === '\u200a' ||
      c === '\u2028' ||
      c === '\u2029' ||
      c === '\u202f' ||
      c === '\u205f' ||
      c === '\u3000' ||
      c === '\ufeff'
    );
  }

  export function isBlankString(str: string): boolean {
    if (Objects.isNotNullOrUndefined(str)) {
      for (const ch of str) {
        if (!Objects.isCharacterWhitespace(ch)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Visitor pattern impl for tree data structure.
   * @param obj - object to visit (visits very first high level obj from biggining)
   * @param visitor your callback, which will accept objects one-by-one and level of nesting, returning children for further processing
   * `visitor` accepts object itself as first argument, level of nesting (root is 0) and may return array of children. If not returns (return undefined) - processing of deeper children levels stops.
   */
  export function visit<OBJ extends {}>(obj: OBJ, visitor: (obj: OBJ, level: number) => OBJ[] | void): void {
    visitLevel(obj, visitor);
  }

  function visitLevel<OBJ extends {}>(
    obj: OBJ,
    visitor: (obj: OBJ, level: number) => OBJ[] | void,
    seen: Set<OBJ> = new Set(),
    level: number = 0,
  ): void {
    if (seen.has(obj)) {
      // already seen this object, skip to avoid infinite loop
      return;
    }

    const children = visitor(obj, level);
    seen.add(obj);
    if (children) {
      for (const child of children) {
        visitLevel(child, visitor, seen, level + 1);
      }
    }
  }

  /**
   * Flattens tree data structure to array of references.
   * @param obj object to start flatten from.
   * @param childrenExtractor - function, which will provide children for each object individually
   * @returns array of references to
   */
  export function flatten<OBJ extends {}>(
    obj: OBJ,
    childrenExtractor: (obj: OBJ, level: number) => OBJ[] | void,
  ): OBJ[] {
    const array: OBJ[] = [];
    visit(obj, (obj, level) => {
      array.push(obj);
      return childrenExtractor(obj, level);
    });
    return array;
  }

  export function setPrototypeOf<P extends object, T>(target: T, proto: P): T & P {
    return Object.setPrototypeOf(target, proto);
  }

  /**
   * Freezes an object and all its properties recursively.
   * @param obj - The object to freeze.
   * @returns The frozen object.
   */
  export function deepFreeze<T>(obj: T): Types.DeepReadonly<T> {
    visit(obj as object, (currentObj) => {
      if (!currentObj) {
        return void 0;
      }

      Object.freeze(currentObj);

      if (Array.isArray(currentObj)) {
        return currentObj;
      }
      if (typeof currentObj === 'object' && currentObj !== null) {
        return Object.values(currentObj);
      }
      return void 0;
    });

    return obj as Types.DeepReadonly<T>;
  }

  export function getKeyByValue<E extends Record<PropertyKey, unknown>, V extends E[keyof E]>(
    enumObj: E,
    enumValue: V,
  ): Types.KeyForValue<E, V> {
    const keys = Objects.keys(enumObj).filter((k) => enumObj[k] === enumValue) as [Types.KeyForValue<E, V>] | [];
    return keys.length > 0 ? keys[0]! : undefined!;
  }

  /**
   * Maps keys and values of object to new keys and values by provided mapper function. Mapper may return undefined to skip mapping of some fields.
   * @param obj source object to map
   * @param mapper returns `undefined` to skip mapping of field, otherwise returns tuple of new key and new value. New key must be unique in result object, otherwise it will be overwritten by last mapped field with same key.
   * @returns mapped object ref
   */
  export function transform<T extends {}, R = Record<PropertyKey, unknown>>(
    obj: T,
    mapper: (key: keyof T, value: T[keyof T]) => [key: keyof R, value: R[keyof R]] | undefined,
  ): R {
    const result = {} as R;
    for (const key of Objects.keys(obj)) {
      const mapped = mapper(key, obj[key]);
      if (mapped) {
        const [newKey, newValue] = mapped;
        result[newKey] = newValue;
      }
    }
    return result;
  }

  export function difference<T extends {}, B extends {}>(object: T, base: B): Partial<T> {
    return transform(object, (key: keyof T, value: T[keyof T]) => {
      const baseValue = base[key as string as keyof B];
      if (!equals(value, baseValue)) {
        if (isObject(value) && isObject(baseValue)) {
          return [key, difference(value, baseValue) as T[keyof T]];
        } else {
          return [key, value];
        }
      }
      return;
    });
  }

  /**
   * Java-`hashCode`-style structural hash for stable per-payload fingerprinting.
   * Output is a non-negative 32-bit integer.
   *
   * Properties:
   *  - Deterministic: same input → same output across runs and JS engines.
   *  - Order-insensitive for plain objects: `{a:1,b:2}` and `{b:2,a:1}` hash
   *    identically (sum of per-entry `key.hash ^ value.hash`, matching
   *    Java's `Map.hashCode` definition).
   *  - Order-sensitive for arrays: `[1,2]` ≠ `[2,1]`.
   *  - Handles every JS scalar type — `undefined`, `null`, `NaN`, `Infinity`,
   *    `BigInt`, `Symbol`, functions — by folding their string forms or known
   *    constants. No throws.
   *
   * Not cycle-safe: a self-referencing structure recurses until stack overflow.
   */
  export function structHash(value: unknown): number {
    return structHashWalk(value) >>> 0;
  }

  /**
   * @returns the 8-character zero-padded lowercase hex form of `structHash(value)`.
   */
  export function structHashHex(value: unknown): string {
    return structHash(value).toString(16).padStart(8, '0');
  }

  function structHashWalk(value: unknown): number {
    if (value === null || value === undefined) {
      return 0;
    }

    switch (typeof value) {
      case 'boolean':
        // Java's Boolean.hashCode constants — distinct, non-trivial, well-known.
        return value ? 1231 : 1237;
      case 'number':
        return hashNumber(value);
      case 'string':
        return hashString(value);
      case 'bigint':
      case 'symbol':
      case 'function':
        // No native numeric encoding — fold their string form.
        return hashString(value.toString());
    }

    if (Array.isArray(value)) {
      // Array: order-sensitive accumulator (Java's List.hashCode).
      let h = 1;
      for (const e of value) {
        h = (Math.imul(31, h) + structHashWalk(e)) | 0;
      }
      return h;
    }

    // Plain object: sum of entry hashes (order-independent).
    let h = 0;
    for (const k of Object.keys(value as object)) {
      h = (h + (hashString(k) ^ structHashWalk((value as Record<string, unknown>)[k]))) | 0;
    }
    return h;
  }

  function hashString(s: string): number {
    // Java's String.hashCode — `s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]`.
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return h;
  }

  /**
   * Scratch views over one 8-byte buffer, shared by every {@link hashNumber} call
   * so that hashing a number allocates nothing. Sharing is safe because the write
   * and the two reads are adjacent statements with no await, callback or property
   * access between them, and each worker thread evaluates its own module instance.
   */
  const SCRATCH_F64 = new Float64Array(1);
  const SCRATCH_U32 = new Uint32Array(SCRATCH_F64.buffer);

  function hashNumber(n: number): number {
    // Canonical encoding for non-finite values so they hash to constants.
    if (Number.isNaN(n)) {
      return 0x7fc00000;
    }
    if (n === Number.POSITIVE_INFINITY) {
      return 0x7f800000;
    }
    if (n === Number.NEGATIVE_INFINITY) {
      return 0xff800000 | 0;
    }
    // For finite numbers, fold the 64-bit IEEE 754 bits to 32 bits via XOR.
    SCRATCH_F64[0] = n;
    return (SCRATCH_U32[0] ^ SCRATCH_U32[1]) | 0;
  }
}
