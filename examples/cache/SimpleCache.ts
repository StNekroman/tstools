import { LoadingCache } from "../../src/caching";

type SimpleEntry = {
  // data goes here
};

export class SimpleCache extends LoadingCache<SimpleEntry> {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_id : string): Promise<SimpleEntry> {
    // loading happens here
    return Promise.reject();
  }

}