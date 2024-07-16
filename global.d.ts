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
