import { Method } from "./method";

export interface BxiosRequest {
  requestId: string;
  method: Method;
  path: string;
  body?: string;
}
