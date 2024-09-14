import { Types } from './Types';

export namespace Objects {

    export function isNotNullOrUndefined<T>(arg : T) : arg is NonNullable<T> {
        return arg !== null && arg !== undefined;
    }

    export function isObject<T = {}>(arg : unknown | T) : arg is Record<keyof T, T[keyof T]> {
        return typeof arg === "object" && arg !== null;
    }

    export function isFunction(arg : unknown) : arg is Function {
        return typeof arg === "function";
    }

    export function isArray<T>(arg : unknown) : arg is T[] {
        return Array.isArray(arg) || (arg instanceof Array);
    }

    export function isString(arg : unknown) : arg is string {
        return typeof arg === "string";
    }

    export function isNumeric(arg : unknown) : arg is number {
        if (!Objects.isNotNullOrUndefined(arg)) {
            return false;
        }
        return typeof arg === "bigint" || typeof arg === "number" && !isNaN(arg as number);
    }

    export function isBoolean(arg : unknown) : arg is boolean {
        return typeof arg === "boolean";
    }

    export function isPrimitive(arg : unknown) : arg is Types.Primitive {
        if (!Objects.isNotNullOrUndefined(arg)) {
            return true;
        }

        if (Objects.isObject(arg) || Objects.isFunction(arg)) {
            return false;
        } else {
            return true;
        }
    }

    export function forEach<T extends {}>(obj : T, callback : (key : keyof T, value : T[keyof T]) => void) : void {
        for (const key of Object.keys(obj) as (keyof T)[]) {
            callback(key, obj[key]);
        }
    }

    /**
     * @param test object
     * @param targetClass target class (constructor) to test against 
     * @returns true, of given test object is constructor of class, which extends target class (actually constructor)
     */
    export function isConstructorOf<T>(test: unknown, targetClass: Types.Newable<T>) : test is Types.Newable<T> {
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
    export function equals<T>(obj1 ?: T, obj2 ?: T) : boolean {
        if (obj1 === obj2) {
            return true;
        } else if (obj1 && obj2 && Objects.isObject(obj1) && Objects.isObject(obj2)) {
            const keys1 : string[] = Object.keys(obj1);
            const keys2 : Set<string> = new Set(Object.keys(obj2));

            for (const key of keys1) {
                if (!Objects.equals(obj1[key as keyof T], obj2[key as keyof T])) {
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
    export function deepCopy<T>(obj : Types.Serializable<T>) : T;
    export function deepCopy<T>(obj : T, transferNotCopyable : true) : T;
    export function deepCopy<T>(obj : T | Types.Serializable<T>, transferNotCopyable ?: true) : T {
        if (Objects.isPrimitive(obj)) {
            return obj;
        }

        if (obj instanceof Date) {
            const date : Date = new Date();
            date.setTime(obj.getTime());
            return date as T;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => deepCopy(item, transferNotCopyable!)) as T;
        }

        if (Objects.isObject(obj)) {
            const copy : T = {} as T;
            Objects.forEach(obj, (key: keyof T, value: T[keyof T]) : void => {
                copy[key] = Objects.deepCopy(value, transferNotCopyable!);
            });
            return copy;
        }

        if (transferNotCopyable) {
            return obj;
        } else {
            throw new Error("Cannot clone not-copyable fields (methods inside?) during Objects.deepCopy.");
        }
    }

    // backed by Objects.deepCopy(..., true), so you can pass obj with functions - they will be mapped to dst objection as is. 
    export function extend<DST extends {}, SRC extends {}>(dst: DST, src: SRC) : DST {
        if (Objects.isNotNullOrUndefined(src)) {
            Objects.forEach(src, (key: keyof SRC | keyof DST, value: SRC[keyof SRC]) : void => {
                if (Objects.isObject(value) && Objects.isObject(dst[key as keyof DST])) {
                    // look deeper...
                    Objects.extend(dst[key as keyof DST] as {}, value);
                } else {
                    // no merge, just pick a copy
                    dst[key as keyof DST] = Objects.deepCopy(value, true) as unknown as DST[keyof DST];
                }
            });
        }
        return dst;
    }

    // from https://stackoverflow.com/a/69330363
    export function isCharacterWhitespace(c : string) : boolean {
        return c === " "
            || c === "\n"
            || c === "\t"
            || c === "\r"
            || c === "\f"
            || c === "\v"
            || c === "\u00a0"
            || c === "\u1680"
            || c === "\u2000"
            || c === "\u200a"
            || c === "\u2028"
            || c === "\u2029"
            || c === "\u202f"
            || c === "\u205f"
            || c === "\u3000"
            || c === "\ufeff";
    }

    export function isBlankString(str : string) : boolean {
        if (Objects.isNotNullOrUndefined(str)) {
            for (const ch of str) {
                if (!Objects.isCharacterWhitespace(ch)) {
                    return false;
                }
            }
        }
        return true;
    }
}
