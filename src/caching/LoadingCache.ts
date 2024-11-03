import { type IDictionary } from "./IDictionary";
import { MemoryDictionary } from "./MemoryDictionary";

export abstract class LoadingCache<T, ARGS extends unknown[] = [string], KEY = ARGS[0]> {
  private readonly map : IDictionary<KEY, Promise<T>>;

  constructor(mapImpl : IDictionary<KEY, Promise<T>> = new MemoryDictionary()) {
    this.map = mapImpl;
  }

  public abstract load(...args: ARGS) : Promise<T>;

  public uniqueKey(...args: ARGS) : KEY {
    return args[0] as KEY;
  }

  public get(...args: ARGS) : Promise<T> {
    const cacheKey = this.uniqueKey(...args);
    if (this.map.has(cacheKey)) {
      return this.map.get(cacheKey)!;
    }

    const promise = this.load(...args);
    this.map.set(cacheKey, promise);
    return promise;
  }

  public has(...args: ARGS) : boolean {
    const cacheKey = this.uniqueKey(...args);
    return this.map.has(cacheKey);
  }

  public put(...[data, ...args]: [T | Promise<T>, ...ARGS]) {
    const cacheKey = this.uniqueKey(...args);
    this.map.set(cacheKey, Promise.resolve(data));
  }

  public clear() : void {
    this.map.clear();
  }
}
