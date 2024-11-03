import { Implements } from "../decorators";
import { type IDictionary } from "./IDictionary";

export class MemoryDictionary<KEY, DATA> implements IDictionary<KEY, DATA> {

  private readonly map : Map<KEY, DATA> = new Map();

  @Implements<IDictionary<KEY, DATA>>
  public has(cacheKey: KEY): boolean {
    return this.map.has(cacheKey);
  }

  @Implements<IDictionary<KEY, DATA>>
  public get(cacheKey: KEY): DATA | undefined {
    return this.map.get(cacheKey);
  }

  @Implements<IDictionary<KEY, DATA>>
  public set(cacheKey: KEY, data: DATA): void {
    this.map.set(cacheKey, data);
  }

  @Implements<IDictionary<KEY, DATA>>
  public delete(cacheKey : KEY): boolean {
    return this.map.delete(cacheKey);
  }

  @Implements<IDictionary<KEY, DATA>>
  public clear(): void {
    this.map.clear();
  }
}
