
import { Cache } from "./Cache";
import { Deffered } from './Deffered';
import { Throttle } from './Throttle';

type DefferedTask<T, ARGS extends unknown[]> = {
  args: ARGS;
  deffered : Deffered<T>;
};

export abstract class ThrottledCache<T, ARGS extends unknown[], KEY = string> extends Cache<T, ARGS, KEY> {

  private readonly queue : DefferedTask<T, ARGS>[] = [];

  private readonly throttledLoadFn : Throttle.IThrottleFunction = Throttle.throttle(() => {
      const tasks = this.queue.slice(); //extract items
      this.queue.length = 0; // dont touch queue any more (in this processing frame)

      this.loadAll(tasks.map(task => task.args)).then((results : PromiseSettledResult<T>[]) => {
        for (let i = 0; i < tasks.length; i++) {
          const result = results[i];
          if (result.status === "fulfilled") {
            tasks[i].deffered.resolve(result.value);
          } else {
            tasks[i].deffered.reject(result.reason);
          }
        }
      });
    }, 1000);

  public get(...args: ARGS) : Promise<T> {
    const cacheKey = this.uniqueKey(...args);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey)!;
    }

    const defferedTask : DefferedTask<T, ARGS> = {
      args : args,
      deffered: new Deffered()
    };
    this.queue.push(defferedTask);

    this._cache.set(cacheKey, defferedTask.deffered.promise);
    this.throttledLoadFn();// trigger real loading someday
    return defferedTask.deffered.promise;
  }

  public loadAll(argsArray :  ARGS[]) : Promise<PromiseSettledResult<T>[]> {
    return Promise.allSettled(argsArray.map((args: ARGS) => this.load(...args))); // just one by one, override this if your cache/service knows how to load data in bulk/batch
  }
}
