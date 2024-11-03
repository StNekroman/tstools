import { LoadingCache } from "../../src/caching/LoadingCache";

export type RequestObject = {
  // data goes here
  uniqueId : string;
};

type ResponseObject = {
  // data goes here
  data: unknown;
};

export class ObjectArgCache extends LoadingCache<ResponseObject, [RequestObject], string> {

  public override uniqueKey(request : RequestObject) : string {
    return request.uniqueId; // use unique cache identifier
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override load(_request : RequestObject): Promise<ResponseObject> {
    // loading happens here
    return Promise.reject();
  }

}