import { Cache } from "../../src/Cache";

type TwoKeyEntry = {
  // data goes here
};

export class TwoKeyCache extends Cache<TwoKeyEntry, [string, number]> {

  public override uniqueKey(id : string, secondId: number) : string {
    return id + "." + secondId; // make unique cache identifier
  }

  public override load(id : string, secondId: number): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

}