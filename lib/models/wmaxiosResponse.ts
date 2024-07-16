import { StatusCode } from "./statusCode";

export interface BxiosResponse<T = any> {
  requestId: string;
  data: T;
  status: StatusCode;
}
