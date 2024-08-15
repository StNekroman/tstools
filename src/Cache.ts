
export abstract class Cache<T, ARGS extends unknown[] = [string], KEY = string> {
  protected readonly _cache : Map<KEY, Promise<T>> = new Map();

  public  load(...args: ARGS) : Promise<T> {
    return Promise.reject();
  }

  public uniqueKey(...args: ARGS) : KEY {
    return args.toString() as KEY;
  }

  public get(...args: ARGS) : Promise<T> {
    const cacheKey = this.uniqueKey(...args);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)!;
    }

    const promise = this.load(...args);
    this._cache.set(cacheKey, promise);
    return promise;
  }

  public clear() {
    this._cache.clear();
  }
}
