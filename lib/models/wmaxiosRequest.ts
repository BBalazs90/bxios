import { Method } from "./method";

export interface WMaxiosRequest {
  requestId: string;
  method: Method;
  path: string;
  body?: string;
}
