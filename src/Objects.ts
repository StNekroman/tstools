import { Types } from './Types';

export namespace Objects {
  export function isNotNullOrUndefined<T>(arg: T | null | undefined): arg is NonNullable<T> {
    return arg !== null && arg !== undefined;
  }

  export function isNullOrUndefined<T>(arg: T | null | undefined): arg is null | undefined {
    return arg === null || arg === undefined;
  }

  export function isObject<T = {}>(arg: unknown | T): arg is Record<keyof T, T[keyof T]> {
    return typeof arg === 'object' && arg !== null;
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

    if (Objects.isObject(arg) || Objects.isFunction(arg)) {
      return false;
    } else {
      return true;
    }
  }

  export function forEach<T extends {}>(obj: T, callback: (key: keyof T, value: T[keyof T]) => void): void {
    for (const key of Object.keys(obj) as (keyof T)[]) {
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

  // port of this https://medium.com/@stheodorejohn/javascript-object-deep-equality-comparison-in-javascript-7aa227e889d4
  export function equals<T1, T2>(obj1?: T1, obj2?: T2): boolean {
    if ((obj1 as unknown) === (obj2 as unknown)) {
      return true;
    } else if (obj1 && obj2 && Objects.isObject(obj1) && Objects.isObject(obj2)) {
      const keys1: string[] = Object.keys(obj1);
      const keys2: Set<string> = new Set(Object.keys(obj2));

      for (const key of keys1) {
        if (!Objects.equals(obj1[key as keyof T1], obj2[key as keyof T2])) {
          return false;
        }
        keys2.delete(key);
      }

      return keys2.size === 0;
    } else {
      return false;
    }
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
    }
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
              true
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
    level: number = 0
  ): void {
    const children = visitor(obj, level);
    if (children) {
      for (const child of children) {
        visitLevel(child, visitor, level + 1);
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
    childrenExtractor: (obj: OBJ, level: number) => OBJ[] | void
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
}
