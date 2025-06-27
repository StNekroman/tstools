export interface ISet<KEY> {
  has(cacheKey: KEY): boolean;
  add(cacheKey: KEY): number;
  delete(cacheKey: KEY): number;
  clear(): void;
}
