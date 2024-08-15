import { Cache } from "../../src/Cache";

type SimpleEntry = {
  // data goes here
};

export class SimpleCache extends Cache<SimpleEntry> {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_id : string): Promise<string> {
    // loading happens here
    return Promise.reject();
  }

}