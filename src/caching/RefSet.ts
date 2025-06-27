import { Implements } from '../decorators';
import { type ISet } from './ISet';
import { RefCountedValue } from './RefCountedValue';

export class RefSet<KEY> implements ISet<KEY> {
  private readonly map: Map<KEY, RefCountedValue<void>> = new Map();

  @(Implements<ISet<KEY>>)
  public has(cacheKey: KEY): boolean {
    return this.map.has(cacheKey);
  }

  @(Implements<ISet<KEY>>)
  public add(cacheKey: KEY): number {
    let refCountedValue = this.map.get(cacheKey);
    if (!refCountedValue) {
      refCountedValue = new RefCountedValue(void 0);
      this.map.set(cacheKey, refCountedValue);
      return refCountedValue.getRefCount();
    } else {
      return refCountedValue.increment();
    }
  }

  @(Implements<ISet<KEY>>)
  public delete(cacheKey: KEY): number {
    const refCountedValue = this.map.get(cacheKey)?.decrement() ?? 0;
    if (refCountedValue <= 0) {
      this.map.delete(cacheKey);
    }
    return refCountedValue;
  }

  @(Implements<ISet<KEY>>)
  public clear(): void {
    this.map.clear();
  }
}
