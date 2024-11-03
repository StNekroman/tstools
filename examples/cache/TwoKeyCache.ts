import { LoadingCache } from "../../src/caching/LoadingCache";

type TwoKeyEntry = {
  // data goes here
};

export class TwoKeyCache extends LoadingCache<TwoKeyEntry, [string, number]> {

  public override uniqueKey(id : string, secondId: number) : string {
    return id + "." + secondId; // make unique cache identifier
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_id : string, _secondId: number): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

}