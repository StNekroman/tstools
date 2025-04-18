import { Functions } from '../Functions';

/**
 * Ported patterns from http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 */
export namespace Throttle {
  export interface ThrottleFunction<ARGS extends unknown[] = void[]> extends Functions.ArgsFunction<ARGS, void> {
    cancel(): void; // cancels and discards any pending calls, but continues to serve new incoming calls
  }

  /**
   * Returns function, which will remember call arguments from it's last invocation,
   * and will fire given callback after specified timeout with previously collected arguments.
   * @param callback to be called, throttled by timeout
   * @param timeout in milliseconds
   */
  export function throttle<ARGS extends unknown[] = void[]>(
    callback: Functions.ArgsFunction<ARGS, void>,
    timeout: number
  ): ThrottleFunction<ARGS> {
    let lastArgs: ARGS | undefined;
    let timerId: any | undefined;

    const throttleFunction: ThrottleFunction<ARGS> = (...args: ARGS): void => {
      lastArgs = args;

      if (timerId === undefined) {
        timerId = setTimeout((): void => {
          callback(...lastArgs!);
          lastArgs = undefined;
          timerId = undefined;
        }, timeout);
      }
    };

    throttleFunction.cancel = (): void => {
      if (timerId !== undefined) {
        clearTimeout(timerId);
        timerId = undefined;
      }
      lastArgs = undefined;
    };

    return throttleFunction;
  }

  /**
   * Returns functions, which will remember arguments from it's last call and (re)schedule given callback to fire (with last arguments)
   * after last function call with specified timeout. New function call delays actual callback further.
   * @param callback to call after timeout
   * @param timeout in milliseconds
   */
  export function deferring<ARGS extends unknown[] = void[]>(
    callback: Functions.ArgsFunction<ARGS, void>,
    timeout: number
  ): ThrottleFunction<ARGS> {
    let lastArgs: ARGS | undefined;
    let timerId: any | undefined;

    const throttleFunction: ThrottleFunction<ARGS> = (...args: ARGS): void => {
      lastArgs = args;

      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      timerId = setTimeout((): void => {
        callback(...lastArgs!);
        lastArgs = undefined;
        timerId = undefined;
      }, timeout);
    };

    throttleFunction.cancel = (): void => {
      if (timerId !== undefined) {
        clearTimeout(timerId);
        timerId = undefined;
      }
      lastArgs = undefined;
    };

    return throttleFunction;
  }
}
