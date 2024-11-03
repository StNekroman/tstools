import { LoadingCache, WeakMemoryDictionary } from "../../src/caching";

type SimpleEntry = {
  // data goes here
};

type SimpleKey = {}; // ref itself will be used as key

export class SimpleWeakCache extends LoadingCache<SimpleEntry, [SimpleKey]> {
  constructor() {
    super(new WeakMemoryDictionary());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_id : SimpleKey): Promise<SimpleEntry> {
    // loading happens here
    return Promise.reject();
  }

}