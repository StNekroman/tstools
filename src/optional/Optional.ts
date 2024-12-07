import { Functions } from '../Functions';
import { Objects } from '../Objects';
import { NoSuchElementException } from './NoSuchElementException';

export class Optional<T> {
  private static readonly EMPTY = new Optional<never>(undefined as unknown as never);

  private constructor(private readonly value: T) {}

  public static of<T>(value: T | undefined): Optional<T> {
    if (Objects.isNotNullOrUndefined(value)) {
      return new Optional(value);
    } else {
      return Optional.EMPTY;
    }
  }

  public static empty(): Optional<never> {
    return Optional.EMPTY;
  }

  public get(): T {
    if (this.isPresent()) {
      return this.value;
    }
    throw new NoSuchElementException('No value present');
  }

  public isPresent(): boolean {
    return Objects.isNotNullOrUndefined(this.value);
  }

  public isEmpty(): boolean {
    return Objects.isNullOrUndefined(this.value);
  }

  public filter(filterFn: Functions.Filter<T>): Optional<T> {
    if (this.isEmpty()) {
      return this;
    } else {
      return filterFn(this.value) ? this : (Optional.EMPTY as Optional<never>);
    }
  }

  public map<R>(mapper: Functions.MapFunction<T, R>): Optional<R> {
    if (this.isEmpty()) {
      return Optional.EMPTY;
    } else {
      return Optional.of(mapper(this.value));
    }
  }

  public flatMap<R>(mapper: Functions.MapFunction<T, Optional<R>>): Optional<R> {
    if (this.isEmpty()) {
      return Optional.EMPTY;
    } else {
      return mapper(this.value);
    }
  }

  public or(provider: Functions.Provider<Optional<T>>): Optional<T> {
    if (this.isPresent()) {
      return this;
    } else {
      return provider();
    }
  }

  public orElse(other: T): T {
    return this.isPresent() ? this.value : other;
  }

  public orElseGet(provider: Functions.Provider<T>): T {
    return this.isPresent() ? this.value : provider();
  }

  public orElseThrow<E extends Error>(provider?: Functions.Provider<E>): T {
    if (this.isEmpty()) {
      throw provider ? provider() : new NoSuchElementException('No value present');
    }
    return this.value;
  }

  public toString(): string {
    return this.isPresent() ? `Optional[${this.value}]` : 'Optional.empty';
  }

  public equals(another: Optional<T>): boolean {
    if (
      this == another ||
      (this.isEmpty() && another.isEmpty()) ||
      (isNaN(this.value as number) && isNaN(another.value as number))
    ) {
      return true;
    }
    return this.value === another.value;
  }

  public property<KEY extends keyof T = keyof T>(key: KEY): Optional<T[KEY]> {
    return Optional.of(this.value[key]);
  }
}
