import { Functions } from "./Functions";

type ResolveMethod<T> = T extends void ? () => void : (arg: T) => void;

/**
 * Inspired by angular.js $deferred (which already present as many standalone libs)
 * @deprecated Avoid using this in your code - community agreed this as anti-pattern for general code. But may be usable in low-level utilities.
 */
export class Deffered<T = void> {

  #resolve! : Functions.Consumer<T>;
  #reject! : Functions.Consumer<unknown>;

  public readonly promise = new Promise((resolve : Functions.Consumer<T>, reject : Functions.Consumer<unknown>) => {
    this.#resolve = resolve;
    this.#reject = reject;
  });

  public resolve = ((arg: T extends void ? void : T) => {
    this.#resolve(arg as T);
  }) as ResolveMethod<T>;

  public reject(data: unknown) {
    this.#reject(data);
  }
}
