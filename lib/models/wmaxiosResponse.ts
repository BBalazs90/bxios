import { StatusCode } from "./statusCode";

export interface WMaxiosResponse<T = any> {
  requestId: string;
  data: T;
  status: StatusCode;
}
