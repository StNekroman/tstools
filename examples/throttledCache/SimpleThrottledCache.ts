import { ThrottledCache } from "../../src/ThrottledCache";

export class SimpleThrottledCache extends ThrottledCache<string> {

  public override load(id: string): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

}
