
export interface IDictionary<KEY, DATA> {
  has(cacheKey : KEY) : boolean;
  get(cacheKey : KEY) : DATA | undefined;
  set(cacheKey : KEY, data : DATA) : void;
  delete(cacheKey : KEY): boolean;
  clear() : void;
}
