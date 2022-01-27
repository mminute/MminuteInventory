import InventoryItem from '../Inventory/InventoryItem';

interface ItemUpdates {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  location?: string;
  dateAquired?: string;
  dateRelinquished?: string;
  notes?: string;
}

export interface IElectronApi {
  ipcRenderer: {
    myPing: () => void;
    myPong: () => void;
    addNewItem: () => void;
    createNewInventory: () => void;
    openExistingInventory: () => void;
    openRecentInventory: (filepath: string) => void;
    saveInventory: () => void;
    updateItem: (updates: ItemUpdates) => void;
    deleteItem: (itemId: string) => void;
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
