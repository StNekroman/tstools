import { ThrottledCache } from "../../src/ThrottledCache";

export class BulkThrottledCache extends ThrottledCache<string> {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_id: string): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override loadAll(_argsArray :  [string][]) : Promise<PromiseSettledResult<string>[]> {
    // loading happens here
    return Promise.reject();
  }

}
