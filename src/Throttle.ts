
import {Functions} from "./Functions";

/**
 * Ported patterns from http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 */
export namespace Throttle {

    export interface IThrottleFunction<T extends unknown[] = void[]> extends Functions.ArgsConsumer<(...args: T) => void> {
        cancel(): void; // cancels and discards any pending calls, but continues to serve new incoming calls
    }

    /**
     * Returns function, which will remember call arguments from it's last invocation,
     * and will fire given callback after specified timeout with previously collected arguments.
     * @param callback to be called, throttled by timeout
     * @param timeout in milliseconds
     */
    export function throttle<T extends unknown[] = void[]>(callback: Functions.ArgsConsumer<(args: T) => void>,
        timeout: number
    ): IThrottleFunction<T> {
        let lastArgs : T | undefined;
        let timerId : NodeJS.Timeout | number | undefined;

        const throttleFunction: IThrottleFunction<T> = (...args: T): void => {
            lastArgs = args;

            if (timerId === undefined) {
                timerId = setTimeout((): void => {
                    callback(lastArgs!);
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
    export function deferring<T extends unknown[] = void[]>(callback: Functions.ArgsConsumer<(args: T) => void>, timeout: number): IThrottleFunction<T> {
        let lastArgs: T | undefined;
        let timerId: NodeJS.Timeout | number | undefined;

        const throttleFunction: IThrottleFunction<T> = (...args: T): void => {
            lastArgs = args;

            if (timerId !== undefined) {
                clearTimeout(timerId);
            }
            timerId = setTimeout((): void => {
                callback(lastArgs!);
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
