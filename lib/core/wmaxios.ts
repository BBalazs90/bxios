import { BxiosError } from "../models/wmaxiosError";
import { BxiosRequest } from "../models/wmaxiosRequest";
import { BxiosResponse } from "../models/wmaxiosResponse";
import { v4 as uuidv4 } from "uuid";
import { Method } from "../models/method";
import { StatusCode } from "../models/statusCode";

let REQUEST_TIMEOUT = 20000;

const get = async (path: string): Promise<BxiosResponse> => {
  return await sendMessage(path, "GET");
};

const post = async (path: string, data: any) => {
  return await sendMessage(path, "POST", data);
};

const sendMessage = async (
  path: string,
  method: Method,
  body?: string
): Promise<BxiosResponse> => {
  const requestId = uuidv4();
  var request: BxiosRequest = {
    requestId: requestId,
    method: method,
    path: path,
    body: body,
  };
  window.chrome.webview.postMessage(request);
  const requestPromise = new Promise(function (resolve, reject) {
    window.chrome.webview.addEventListener("message", (event) => {
      const message = event.data;
      const response = JSON.parse(message) as BxiosResponse;
      // if requestIds don't match, then this response wasn't meant for the request, ignore it
      if (response.requestId != requestId) {
        return;
      }
      if (response.status <= 299) {
        resolve(response);
      } else {
        var error: BxiosError = {
          message: response.data,
          status: response.status,
        };
        reject(error);
      }
    });
  });

  return Promise.race([requestPromise, timeoutPromise(REQUEST_TIMEOUT)]);
};

const timeoutPromise = (timeout: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error: BxiosError = {
        message: `Request timed out after ${timeout / 1000} seconds`,
        status: StatusCode.RequestTimeout,
      };
      reject(error);
    }, timeout);
  });
};

export const wmaxios = { get, post };
