import { Functions } from "./Functions";

/**
 * Inspired by angular.js $deferred (which already present as many standalone libs)
 * @deprecated Avoid using this in your code - community agreed this as anti-pattern for general code. But may be usable in low-level utilities.
 */
export class Deffered<T> {

  #resolve! : Functions.Consumer<T>;
  #reject! : Functions.Consumer<unknown>;

  public readonly promise = new Promise((resolve : Functions.Consumer<T>, reject : Functions.Consumer<unknown>) => {
    this.#resolve = resolve;
    this.#reject = reject;
  });

  public resolve(data: T) {
    this.#resolve(data);
  }

  public reject(data: unknown) {
    this.#reject(data);
  }
}
