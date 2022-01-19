export interface IElectronApi {
  ipcRenderer: {
    myPing: () => void;
    myPong: () => void;
    on: (channel: string, cb: (data: any) => void) => void;
    removeAllListeners: (
      channel: Array<string>,
      cb: (data: any) => void
    ) => void;
  };
}

declare global {
  interface Window {
    electron: IElectronApi;
  }
}
