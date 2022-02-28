const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    updateItem(itemUpdates) {
      ipcRenderer.send('update-item', itemUpdates);
    },
    deleteItem(itemId) {
      ipcRenderer.send('delete-item', itemId);
    },
    openExistingInventory() {
      ipcRenderer.send('open-existing-inventory');
    },
    openRecentInventory(filepath) {
      ipcRenderer.send('open-recent-inventory', filepath);
    },
    createNewInventory() {
      ipcRenderer.send('create-new-inventory');
    },
    saveInventory() {
      ipcRenderer.send('save-inventory');
    },
    addNewItem() {
      ipcRenderer.send('add-new-item');
    },
    updateSettings(updates) {
      ipcRenderer.send('update-settings', updates);
    },
    unsafeCreateNewInventory() {
      ipcRenderer.send('unsafe-create-new-inventory');
    },
    saveAndCreateNewInventory() {
      ipcRenderer.send('save-and-create-new-inventory');
    },
    unsafeOpenExistingInventory() {
      ipcRenderer.send('unsafe-open-existing-inventory');
    },
    saveAndOpenExistingInventory() {
      ipcRenderer.send('save-and-open-existing-inventory');
    },
    updateFileSettings(updates) {
      ipcRenderer.send('update-file-settings', updates);
    },
    on(channel, func) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners(channel, cb) {
      ipcRenderer.removeAllListeners(channel, cb);
    },
    once(channel, func) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    },
  },
});
