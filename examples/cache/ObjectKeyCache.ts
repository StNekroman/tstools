import { LoadingCache } from "../../src/caching/LoadingCache";

type RequestObject = {
  // data goes here
  uniqueId : string;
};

type ResponseObject = {
  // data goes here
  data: unknown;
};

export class ObjectKeyCache extends LoadingCache<ResponseObject, [RequestObject], RequestObject> {

  public override uniqueKey(request : RequestObject) : RequestObject {
    return request; // use request itself as cache identifier
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_request : RequestObject): Promise<ResponseObject> {
    // loading happens here
    return Promise.reject();
  }

}