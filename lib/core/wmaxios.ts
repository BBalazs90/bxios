import { WMaxiosError } from "../models/wmaxiosError";
import { WMaxiosRequest } from "../models/wmaxiosRequest";
import { WMaxiosResponse } from "../models/wmaxiosResponse";
import { v4 as uuidv4 } from "uuid";
import { Method } from "../models/method";
import { StatusCode } from "../models/statusCode";

declare global {
  interface Window {
  chrome: {
    webview: {
      postMessage: (message: any) => void;
      addEventListener: (
        event: string,
        listener: (event: MessageEvent) => void
      ) => void;
    };
  };
}
}

let REQUEST_TIMEOUT = 20000;

const get = async (path: string): Promise<WMaxiosResponse> => {
  return await sendMessage(path, "GET");
};

const post = async (path: string, data: any) => {
  return await sendMessage(path, "POST", data);
};

const put = async (path: string, data: any) => {
  return await sendMessage(path, "PUT", data);
};

const patch = async (path: string, data: any) => {
  return await sendMessage(path, "PATCH", data);
};

const _delete = async (path: string) => {
  return await sendMessage(path, "DELETE");
};

const sendMessage = async (
  path: string,
  method: Method,
  body?: string
): Promise<WMaxiosResponse> => {
  const requestId = uuidv4();
  var request: WMaxiosRequest = {
    requestId: requestId,
    method: method,
    path: path,
    body: body,
  };
  window.chrome.webview.postMessage(request);
  const requestPromise = new Promise(function (resolve, reject) {
    window.chrome.webview.addEventListener("message", (event) => {
      const message = event.data;
      const response = JSON.parse(message) as WMaxiosResponse;
      // if requestIds don't match, then this response wasn't meant for the request, ignore it
      if (response.requestId != requestId) {
        return;
      }
      if (response.status <= 299) {
        resolve(response);
      } else {
        var error: WMaxiosError = {
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
      const error: WMaxiosError = {
        message: `Request timed out after ${timeout / 1000} seconds`,
        status: StatusCode.RequestTimeout,
      };
      reject(error);
    }, timeout);
  });
};

export const wmaxios = { get, post, put, patch, delete: _delete };
