export interface IElectronApi {
  ipcRenderer: {
    myPing: () => void;
    myPong: () => void;
    on: (channel: string, cb: () => void) => any;
    removeAllListeners: (channel: Array<string>, cb: () => void) => any;
  };
}

declare global {
  interface Window {
    electron: IElectronApi;
  }
}
