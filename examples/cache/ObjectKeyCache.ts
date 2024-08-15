import { Cache } from "../../src/Cache";

type RequestObject = {
  // data goes here
  uniqueId : string;
};

type ResponseObject = {
  // data goes here
  data: unknown;
};

export class ObjectKeyCache extends Cache<ResponseObject, [RequestObject], RequestObject> {

  public override uniqueKey(request : RequestObject) : RequestObject {
    return request; // use request itself as cache identifier
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_request : RequestObject): Promise<ResponseObject> {
    // loading happens here
    return Promise.reject();
  }

}