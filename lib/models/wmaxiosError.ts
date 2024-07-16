import { StatusCode } from "./statusCode";

export interface WMaxiosError {
  message: string;
  status: StatusCode;
}
