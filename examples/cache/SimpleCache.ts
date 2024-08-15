import { Cache } from "../../src/Cache";

type SimpleEntry = {
  // data goes here
};

export class SimpleCache extends Cache<SimpleEntry, [string]> {

  public override load(id : string): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

}