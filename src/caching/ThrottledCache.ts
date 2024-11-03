
import { LoadingCache } from "./LoadingCache";
import { Deffered } from '../Deffered';
import { Throttle } from '../throttle/Throttle';

type DefferedTask<T, ARGS extends unknown[]> = {
  args: ARGS;
  deffered : Deffered<T>;
};

export abstract class ThrottledCache<T, ARGS extends unknown[] = [string], KEY = string> extends LoadingCache<T, ARGS, KEY> {

  private readonly queue : DefferedTask<T, ARGS>[] = [];

  private readonly throttledLoadFn : Throttle.ThrottleFunction;

  constructor(timeout : number = 200, mapImpl : Map<KEY, Promise<T>> = new Map()) {
    super(mapImpl);

    this.throttledLoadFn = Throttle.throttle(() => {
      this.processQueue();
    }, timeout);
  }

  public get(...args: ARGS) : Promise<T> {
    if (super.has(...args)) {
      return super.get(...args);
    }

    const defferedTask : DefferedTask<T, ARGS> = {
      args : args,
      deffered: new Deffered()
    };
    this.queue.push(defferedTask);

    super.put(defferedTask.deffered.promise, ...args);
    this.throttledLoadFn(); // trigger real loading someday
    return defferedTask.deffered.promise;
  }

  public loadAll(argsArray :  ARGS[]) : Promise<PromiseSettledResult<T>[]> {
    return Promise.allSettled(argsArray.map((args: ARGS) => this.load(...args))); // just one by one, override this method if your cache/service knows how to load data in bulk/batch
  }

  private processQueue() {
    const tasks = this.queue.slice(); //extract items
    this.queue.length = 0; // dont touch queue any more (in this processing frame)

    if (tasks.length > 0) {
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
    }
  }

  public override clear() {
    super.clear();

    const tasks = this.queue.slice();
    this.queue.length = 0;
    for (const task of tasks) {
      task.deffered.reject("clear cache");
    }
  }
}
