export interface ISet<KEY> {
  has(cacheKey: KEY): boolean;
  add(cacheKey: KEY): void;
  delete(cacheKey: KEY): boolean;
  clear(): void;
}
