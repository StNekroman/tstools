export class RefCountedValue<T> {
  private readonly value: T;
  private refCount: number;

  constructor(value: T) {
    this.value = value;
    this.refCount = 1;
  }

  public getValue(): T {
    return this.value;
  }

  public increment(): number {
    return ++this.refCount;
  }

  public decrement(): number {
    return --this.refCount;
  }

  public getRefCount(): number {
    return this.refCount;
  }
}
