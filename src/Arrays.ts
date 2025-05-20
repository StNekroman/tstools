import { Functions } from './Functions';

export namespace Arrays {
  export function deleteItem<T>(arr: T[], item: T): boolean {
    const index = arr.indexOf(item);
    if (index !== -1) {
      arr.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  export function pushAll<T>(dst: T[], src: T[]): T[] {
    for (const item of src) {
      dst.push(item);
    }
    return dst;
  }

  export function shuffle<T>(arr: T[]): T[] {
    for (let index = arr.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index - 1));
      const temp = arr[index];
      arr[index] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
    return arr;
  }

  export function haveIntersection<T>(array1: T[], array2: T[]): boolean {
    if (array1.length > 10 || array2.length > 10) {
      // Ensure array1 is the smaller array for optimal performance
      if (array1.length > array2.length) [array1, array2] = [array2, array1];

      const set = new Set(array1);

      for (const item of array2) {
        if (set.has(item)) {
          return true;
        }
      }

      return false;
    } else {
      for (const item1 of array1) {
        for (const item2 of array2) {
          if (item1 === item2) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Filters array subsequent items until first not-match.
   *
   * @param arr input array
   * @param filter filter function
   * @param includeLast if true (default is false) - last non matching item will be included.
   * @returns filtered array
   */
  export function filterUntil<T>(arr: T[], filter: Functions.Filter<T>, includeLast: boolean = false): T[] {
    const result = [];
    for (const item of arr) {
      if (filter(item)) {
        result.push(item);
      } else {
        if (includeLast) {
          result.push(item);
        }
        break;
      }
    }
    return result;
  }

  export function getFirst<T>(itemOrArray: T | T[]): T | undefined {
    if (Array.isArray(itemOrArray)) {
      return itemOrArray[0];
    } else {
      itemOrArray;
    }
  }
}
