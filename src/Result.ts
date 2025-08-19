import { type Functions } from './Functions';
import { type Types } from './Types';

export type Success<T extends Types.Serializable<T> | void> = Result<T, never>;
export type Failure<E extends Types.Serializable<E>> = Result<never, E>;
export type SuccessData<T extends Types.Serializable<T> | void> = Pick<Success<T>, 'data'>;
export type FailureData<E extends Types.Serializable<E>> = Pick<Failure<E>, 'error'>;

export namespace Success {
  export function isSuccessData<T extends Types.Serializable<T>>(
    result: SuccessData<T> | FailureData<Types.Serializable>
  ): result is SuccessData<T> {
    return (result as FailureData<Types.Serializable>).error === undefined && 'data' in (result as SuccessData<T>);
  }
}
export namespace Failure {
  export function isFailureData<E extends Types.Serializable<E>>(
    result: SuccessData<Types.Serializable> | FailureData<E>
  ): result is FailureData<E> {
    return (result as FailureData<E>).error !== undefined;
  }
}

export class Result<T extends Types.Serializable<T> | void, E extends Types.Serializable<E>> {
  private constructor(data: T, error: never);
  private constructor(data: never, error: E);
  private constructor(public readonly data: T, public readonly error: E) {}

  public static success(): Success<void>;
  public static success<T extends Types.Serializable<T> | void = void>(data: T): Success<T>;
  public static success<T extends Types.Serializable<T> | void = void>(data?: T): Success<T> {
    return new Result(data as Types.Serializable<T> | void, undefined as never) as Success<T>;
  }

  public static failure<E extends Types.Serializable<E>>(error: E): Failure<E> {
    return new Result(undefined as never, error);
  }

  public static from<T extends Types.Serializable<T>, E extends Types.Serializable<E>>(
    serializable: SuccessData<T> | FailureData<E>
  ): Result<T, E> {
    if (Success.isSuccessData(serializable)) {
      return new Result(serializable.data, undefined as never);
    } else if (Failure.isFailureData(serializable)) {
      return new Result(undefined as never, serializable.error);
    } else {
      throw new Error('Invalid Result type');
    }
  }

  public isSuccess(): this is Success<T> {
    return this.error === undefined;
  }

  public isFailure(): this is Failure<E> {
    return this.error !== undefined;
  }

  public getData(): T {
    if (this.isSuccess()) return this.data as T;
    throw new Error('Cannot get data from a Failure');
  }

  public getError(): E {
    if (this.isFailure()) return this.error as E;
    throw new Error('Cannot get error from a Success');
  }

  public map<U extends Types.Serializable<U>>(f: Functions.MapFunction<T, U>): Result<U, E> {
    return this.isSuccess() ? Result.success(f(this.data)) : (this as unknown as Result<U, E>);
  }

  public flatMap<T2 extends Types.Serializable<T2>, E2 extends Types.Serializable<E2>>(
    f: Functions.MapFunction<T, Result<T2, E2>>
  ): Result<T2, E2> {
    return this.isSuccess() ? f(this.data) : (this as unknown as Result<never, E>);
  }

  public toJSON(): SuccessData<T> | FailureData<E> {
    return {
      data: this.data,
      error: this.error,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  public [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toJSON();
  }

  public static groupResults<T extends Types.Serializable<T>, E extends Types.Serializable<E>>(
    results: Result<T, E>[]
  ): {
    successes: Success<T>[];
    failures: Failure<E>[];
  } {
    return results.reduce(
      (container, result) => {
        if (result.isSuccess()) {
          container.successes.push(result as Success<T>);
        } else {
          container.failures.push(result as Failure<E>);
        }
        return container;
      },
      {
        successes: [] as Success<T>[],
        failures: [] as Failure<E>[],
      }
    );
  }
}
