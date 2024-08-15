import { ThrottledCache } from "../../src/ThrottledCache";

export class BulkThrottledCache extends ThrottledCache<string> {

  public override load(id: string): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

  public override loadAll(argsArray :  [string][]) : Promise<PromiseSettledResult<string>[]> {
    // loading happens here
    return Promise.reject();
  }

}
