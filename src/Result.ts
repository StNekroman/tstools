import { type Functions } from './Functions';

export type Success<T> = Result<T, never>;
export type Failure<E> = Result<never, E>;
export type SuccessData<T> = { data: T };
export type FailureData<E> = { error: E };
export type ResultData<T, E> = SuccessData<T> | FailureData<E>;

export namespace Success {
  export function isSuccessData<T>(result: SuccessData<T> | FailureData<unknown>): result is SuccessData<T> {
    return result instanceof Result
      ? result.isSuccess()
      : (result as FailureData<unknown>).error === undefined && 'data' in (result as SuccessData<T>);
  }
}
export namespace Failure {
  export function isFailureData<E>(result: SuccessData<unknown> | FailureData<E>): result is FailureData<E> {
    return result instanceof Result ? result.isFailure() : (result as FailureData<E>).error !== undefined;
  }
}

export class Result<T, E> implements SuccessData<T>, FailureData<E> {
  private constructor(data: T, error: never);
  private constructor(data: never, error: E);
  private constructor(
    public readonly _data: T,
    public readonly _error: E,
  ) {}

  public static success(): Success<void>;
  public static success<T = void>(data: T): Success<T>;
  public static success<T = void>(data?: T): Success<T> {
    return new Result(data, undefined as never) as Success<T>;
  }

  public static failure<E>(error: E): Failure<E> {
    return new Result(undefined as never, error);
  }

  public static from<T, E>(serializable: SuccessData<T> | FailureData<E>): Result<T, E> {
    if (Success.isSuccessData(serializable)) {
      return new Result(serializable.data, undefined as never);
    } else if (Failure.isFailureData(serializable)) {
      return new Result(undefined as never, serializable.error);
    } else {
      throw new Error('Invalid Result type');
    }
  }

  public isSuccess(): this is Success<T> {
    return this._error === undefined;
  }

  public isFailure(): this is Failure<E> {
    return this._error !== undefined;
  }

  public get data(): T {
    if (this.isSuccess()) return this._data;
    throw new Error('Cannot get data from a Failure');
  }

  public get error(): E {
    if (this.isFailure()) return this._error;
    throw new Error('Cannot get error from a Success');
  }

  public map<U>(f: Functions.MapFunction<T, U>): Result<U, E> {
    return this.isSuccess() ? Result.success(f(this._data)) : (this as unknown as Result<U, E>);
  }

  public flatMap<T2, E2>(f: Functions.MapFunction<T, Result<T2, E2>>): Result<T2, E | E2> {
    return this.isSuccess() ? f(this._data) : (this as unknown as Result<never, E2>);
  }

  public toJSON(): SuccessData<T> | FailureData<E> {
    return {
      data: this._data,
      error: this._error,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }

  public [Symbol.for('nodejs.util.inspect.custom')]() {
    return this.toJSON();
  }

  public static groupResults<T, E>(
    results: Result<T, E>[],
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
      },
    );
  }
}
