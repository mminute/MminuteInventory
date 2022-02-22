import InventoryItem from '../Inventory/InventoryItem';

interface ItemUpdates {
  category?: string;
  dateAquired?: string;
  dateRelinquished?: string;
  description?: string;
  id: string;
  location?: string;
  name?: string;
  notes?: string;
  serialNumber?: string;
  url?: string;
}

interface SettingsUpdates {
  showArchived: boolean;
  clearRecentFiles: boolean;
  clearAllFileSettings: boolean;
  clearAllApplicationData: boolean;
  secrets: { goodreadsApiKey: string | null };
}

interface FileSettings {
  sortCol?: string;
  sortOrder: 'asc' | 'desc';
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
    updateSettings: (updates: SettingsUpdates) => void;
    unsafeCreateNewInventory: () => void;
    saveAndCreateNewInventory: () => void;
    unsafeOpenExistingInventory: () => void;
    saveAndOpenExistingInventory: () => void;
    updateFileSettings: (updated: FileSettings) => void;
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
