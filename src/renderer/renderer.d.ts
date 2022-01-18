export interface IElectronApi {
  ipcRenderer: {
    myPing: () => void;
    myPong: () => void;
  };
}

declare global {
  interface Window {
    electron: IElectronApi;
  }
}
