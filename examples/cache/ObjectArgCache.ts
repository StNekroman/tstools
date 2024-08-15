import { Cache } from "../../src/Cache";

export type RequestObject = {
  // data goes here
  uniqueId : string;
};

type ResponseObject = {
  // data goes here
  data: unknown;
};

export class ObjectArgCache extends Cache<ResponseObject, [RequestObject]> {

  public override uniqueKey(request : RequestObject) : string {
    return request.uniqueId; // use unique cache identifier
  }

  public override load(request : RequestObject): Promise<ResponseObject> {
    // loading happens here
    return Promise.reject();
  }

}