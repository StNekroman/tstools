
export abstract class Cache<T, ARGS extends unknown[] = [string], KEY = string> {
  private readonly _cache : Map<KEY, Promise<T>> = new Map();

  public abstract load(...args: ARGS) : Promise<T>;

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

  public has(...args: ARGS) : boolean {
    const cacheKey = this.uniqueKey(...args);
    return this._cache.has(cacheKey);
  }

  public put(...[data, ...args]: [T | Promise<T>, ...ARGS]) {
    const cacheKey = this.uniqueKey(...args);
    this._cache.set(cacheKey, Promise.resolve(data));
  }

  public clear() {
    this._cache.clear();
  }
}
