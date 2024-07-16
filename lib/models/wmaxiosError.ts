import { StatusCode } from "./statusCode";

export interface BxiosError {
  message: string;
  status: StatusCode;
}
