import { Implements } from '../decorators';
import { type IDictionary } from './IDictionary';

export class WeakMemoryDictionary<KEY extends object | Symbol, DATA extends object> implements IDictionary<KEY, DATA> {
  #map: WeakMap<KEY, WeakRef<DATA>> = new WeakMap();

  @(Implements<IDictionary<KEY, DATA>>)
  public has(cacheKey: KEY): boolean {
    return this.get(cacheKey) !== undefined;
  }

  @(Implements<IDictionary<KEY, DATA>>)
  public get(cacheKey: KEY): DATA | undefined {
    const value = this.#map.get(cacheKey);
    return value?.deref();
  }

  @(Implements<IDictionary<KEY, DATA>>)
  public set(cacheKey: KEY, data: DATA): void {
    this.#map.set(cacheKey, new WeakRef(data));
  }

  @(Implements<IDictionary<KEY, DATA>>)
  public delete(cacheKey: KEY): boolean {
    return this.#map.delete(cacheKey);
  }

  @(Implements<IDictionary<KEY, DATA>>)
  public clear(): void {
    this.#map = new WeakMap();
  }
}
