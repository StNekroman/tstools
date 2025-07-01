import { Implements } from '../decorators';
import { type ISet } from './ISet';
import { RefCountedValue } from './RefCountedValue';

/**
 * Implementation of ISet, which holds references count for each entry.
 * Subsequent additions will increase ref counter.
 * Subsequent removal will decrease ref counter, actual deletion will happen on refCount = 0
 */
export class RefSet<VALUE> implements ISet<VALUE> {
  private readonly map: Map<VALUE, RefCountedValue<void>> = new Map();

  /**
   * Checks if given valus is present in the set.
   */
  @(Implements<ISet<VALUE>>)
  public has(value: VALUE): boolean {
    return this.map.has(value);
  }

  /**
   * Subsequent additions will increase ref counter.
   * @param cacheKey * Subsequent additions will increase ref counter.
   * @returns new ref counter for given value
   */
  @(Implements<ISet<VALUE>>)
  public add(value: VALUE): number {
    let refCountedValue = this.map.get(value);
    if (!refCountedValue) {
      refCountedValue = new RefCountedValue(void 0);
      this.map.set(value, refCountedValue);
      return refCountedValue.getRefCount();
    } else {
      return refCountedValue.increment();
    }
  }

  /**
   * Decreases ref counter, actual deletion happens on refCount = 0
   * @returns new ref counter for given value
   */
  @(Implements<ISet<VALUE>>)
  public delete(value: VALUE, allRefs: boolean = false): number {
    if (allRefs) {
      this.map.delete(value);
      return 0;
    } else {
      const refCountedValue = this.map.get(value)?.decrement() ?? 0;
      if (refCountedValue <= 0) {
        this.map.delete(value);
      }
      return refCountedValue;
    }
  }

  /**
   * Removes completely all entries from this set, without looking on ref counters.
   */
  @(Implements<ISet<VALUE>>)
  public clear(): void {
    this.map.clear();
  }

  /**
   * @returns ref counter for specified value, if present
   */
  public refs(value: VALUE): number {
    const refCountedValue = this.map.get(value);
    return refCountedValue?.getRefCount() ?? 0;
  }

  /**
   * @returns size of the set
   */
  public size(): number {
    return this.map.size;
  }

  public keys(): IterableIterator<VALUE> {
    return this.map.keys();
  }

  public *[Symbol.iterator](): IterableIterator<VALUE> {
    for (const key of this.map.keys()) {
      yield key;
    }
  }
}
